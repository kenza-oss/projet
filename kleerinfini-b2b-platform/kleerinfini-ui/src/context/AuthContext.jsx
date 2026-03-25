import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import axios from "../api/axios";
import realTimeService from "../services/RealTimeService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // SYNCHRONOUS INITIALIZATION: Read both user object AND explicit role
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        const storedRole = localStorage.getItem("user_role");

        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                // Ensure role is present if we have it explicitly
                if (!parsed.role && storedRole) {
                    parsed.role = storedRole;
                }

                const storedToken = localStorage.getItem("token");
                if (storedToken) {
                    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
                }
                return parsed;
            } catch (e) {
                console.error("Failed to parse stored user", e);
                return null;
            }
        }
        return null;
    });

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        realTimeService.disconnect();
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_email");
        delete axios.defaults.headers.common["Authorization"];
        window.location.href = "/";
    }, []);

    const initAuth = useCallback(async () => {
        const storedToken = localStorage.getItem("token");
        const storedUser = user;

        if (storedToken && storedUser) {
            setToken(storedToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

            const connectionId = storedUser.user_id || storedUser.user || storedUser.id;
            if (connectionId) {
                realTimeService.connect(connectionId, storedToken);
            }

            try {
                const isProducer = storedUser.role === 'producer';
                const isClient = storedUser.role === 'client';

                let endpoint = "profiles/me/"; 
                if (isProducer) endpoint = "profiles/me/";
                else if (isClient) endpoint = "client-profiles/me/";

                const res = await axios.get(endpoint);

                // Merging profile data, specifically capturing validation status
                setUser(prev => {
                    const profileData = res.data;
                    const updated = { 
                        ...prev, 
                        ...profileData,
                        is_verified: profileData.is_verified || profileData.is_approved || false 
                    };
                    if (!updated.role && prev?.role) updated.role = prev.role;

                    localStorage.setItem("user", JSON.stringify(updated));
                    if (updated.role) localStorage.setItem("user_role", updated.role);
                    return updated;
                });

                if (res.data.user_email) {
                    localStorage.setItem("user_email", res.data.user_email);
                }
            } catch (err) {
                console.error("Auth init verify failed", err);
                if (err.response?.status === 404) {
                    console.warn("Profile endpoint 404, using local fallback.");
                } else if (err.response?.status === 401) {
                    logout();
                    return;
                }
            }
        } else {
            setToken(null);
            setUser(null);
        }
        setLoading(false);
    }, [user, logout]);

    useEffect(() => {
        initAuth();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const login = async (email, password) => {
        try {
            const res = await axios.post("login/", { email, password });
            const { access, refresh, user: userData, token: alternateToken } = res.data;
            const accessToken = access || alternateToken;

            if (accessToken) {
                setToken(accessToken);
                localStorage.setItem("token", accessToken);
                if (refresh) localStorage.setItem("refresh", refresh);
                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            }

            if (userData) {
                // Pre-identify validation status if present in login response
                const userWithStatus = {
                    ...userData,
                    is_verified: userData.is_verified || userData.is_approved || false
                };
                setUser(userWithStatus);
                localStorage.setItem("user", JSON.stringify(userWithStatus));
                
                const connectionId = userData.user_id || userData.user || userData.id;
                if (accessToken) {
                    realTimeService.connect(connectionId, accessToken);
                }
            } else if (accessToken) {
                // Fetch full profile if not in login response
                await initAuth();
            }
            return true;
        } catch (err) {
            console.error("Login failed", err);
            throw err;
        }
    };

    const registerClient = async (data) => {
        try {
            const res = await axios.post("register/", data);
            const { access, refresh, user: userData } = res.data;

            if (access) {
                setToken(access);
                localStorage.setItem("token", access);
                if (refresh) localStorage.setItem("refresh", refresh);
                axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
            }

            if (userData) {
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
            }

            return res.data;
        } catch (err) {
            console.error("Registration failed", err);
            throw err;
        }
    };

    const value = useMemo(() => ({
        user,
        token,
        loading,
        login,
        logout,
        registerClient,
        isAuthenticated: !!user,
        initAuth
    }), [user, token, loading, login, logout, registerClient, initAuth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
