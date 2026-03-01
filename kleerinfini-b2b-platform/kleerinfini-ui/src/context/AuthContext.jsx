import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import realTimeService from "../services/RealTimeService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse stored user", e);
                }
            }

            if (storedToken && storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

                // Connect WebSocket using User UUID strictly
                const connectionId = parsedUser.user_id || parsedUser.user || parsedUser.id;
                if (connectionId) {
                    realTimeService.connect(connectionId, storedToken);
                }

                try {
                    const res = await axios.get("profiles/me/");
                    setUser(res.data);
                    localStorage.setItem("user", JSON.stringify(res.data));
                    if (res.data.user_email) {
                        localStorage.setItem("user_email", res.data.user_email);
                    }
                } catch (err) {
                    console.error("Auth init failed to fetch fresh user", err);
                    // If 401, refresh failed in axios interceptor already
                    // Only log out on true 401s (expired session), not 500s or network errors
                    if (err.response?.status === 401) {
                        console.warn("Session expired and refresh failed, logging out");
                        logout();
                    } else {
                        console.warn("Server unavailable or other error, keeping local user state for now");
                    }
                }
            }
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

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        registerClient,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
