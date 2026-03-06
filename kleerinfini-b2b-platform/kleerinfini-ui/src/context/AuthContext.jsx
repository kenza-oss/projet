import { createContext, useContext, useState, useEffect, useMemo } from "react";
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

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("token");
            const storedUser = user;

            if (storedToken && storedUser) {
                setToken(storedToken);
                axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

                const connectionId = storedUser.user_id || storedUser.user || storedUser.id;
                if (connectionId) {
                    // WebSocket is initialized independently from the profile fetch
                    realTimeService.connect(connectionId, storedToken);
                }

                try {
                    // 🚀 Endpoints match backend
                    const isProducer = storedUser.role === 'producer';
                    const isClient = storedUser.role === 'client';

                    let endpoint = "profiles/me/"; // Default fallback
                    if (isProducer) endpoint = "profiles/me/";
                    else if (isClient) endpoint = "client-profiles/me/";

                    console.log(`[Auth] Fetching ${storedUser.role} profile from: ${endpoint}`);
                    const res = await axios.get(endpoint);

                    // EXTREME CARE: Merge to preserve 'role'
                    setUser(prev => {
                        const updated = { ...prev, ...res.data };
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
                    // If it's a 404, the endpoint might be wrong or profile missing, 
                    // but don't logout if we already have local data to avoid ejection.
                    if (err.response?.status === 404) {
                        console.warn("Profile endpoint 404, creating default local session fallback.");
                        // 🔥 CRITICAL: Force a fallback profile to keep the app alive
                        setUser(prev => {
                            if (!prev) return prev;
                            const fallback = {
                                ...prev,
                                company_name: prev.company_name || 'En attente de profil',
                                is_verified: false,
                            };
                            localStorage.setItem("user", JSON.stringify(fallback));
                            return fallback;
                        });
                        // Keep loading = false to allow entry with local data
                    } else if (err.response?.status === 401) {
                        logout();
                        return; // Exit early
                    }
                }
            } else {
                // Clear any partial data if token is missing
                setToken(null);
                setUser(null);
            }
            // CRITICAL: Loading is false ONLY after we tried to verify
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            // Updated to user specified endpoint
            // Corrected endpoint from 'auth/login/' to 'login/'
            const res = await axios.post("login/", { email, password });
            // Adapt based on actual response structure
            const { access, refresh, user: userData, token } = res.data;

            // Handle different token keys
            const accessToken = access || token;

            if (accessToken) {
                setToken(accessToken);
                localStorage.setItem("token", accessToken);
                if (refresh) localStorage.setItem("refresh", refresh);
                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            }

            // If user data comes in login response
            if (userData) {
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                if (accessToken) {
                    const connectionId = userData.user_id || userData.user || userData.id;
                    realTimeService.connect(connectionId, accessToken);
                }
            } else if (accessToken) {
                // Otherwise fetch it using the stable endpoint
                try {
                    const userRes = await axios.get("profiles/me/");
                    const fullUserData = userRes.data;
                    setUser(fullUserData);
                    localStorage.setItem("user", JSON.stringify(fullUserData));
                    if (fullUserData.user_email) {
                        localStorage.setItem("user_email", fullUserData.user_email);
                    }
                    const connectionId = fullUserData.user_id || fullUserData.user || fullUserData.id;
                    realTimeService.connect(connectionId, accessToken);
                } catch (e) {
                    console.warn("Could not fetch user details", e);
                }
            }
            return true;
        } catch (err) {
            console.error("Login failed", err);
            throw err;
        }
    };

    const logout = () => {
        realTimeService.disconnect();
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        window.location.href = "/";
    };

    const registerClient = async (data) => {
        try {
            const res = await axios.post("register/", data);
            const { access, refresh, user: userData } = res.data;

            // Auto-login after registration
            if (access) {
                setToken(access);
                localStorage.setItem("token", access);
                if (refresh) localStorage.setItem("refresh", refresh);
                axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
            }

            // Store user data
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
    }), [user, token, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
