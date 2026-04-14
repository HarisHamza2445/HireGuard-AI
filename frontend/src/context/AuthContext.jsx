import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('hireguardToken'));
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_BASE_URL || '';

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axios.get(`${API_URL}/api/auth/profile`, config);
                    if (data.success) {
                        setUser(data);
                    }
                } catch (error) {
                    console.error('Failed to load profile:', error);
                    logout(); // Token likely invalid/expired
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        if (data.success) {
            localStorage.setItem('hireguardToken', data.token);
            setToken(data.token);
            setUser(data);
            return data;
        }
        throw new Error(data.message || 'Login Failed');
    };

    const register = async (userData) => {
        const { data } = await axios.post(`${API_URL}/api/auth/register`, userData);
        if (data.success) {
            localStorage.setItem('hireguardToken', data.token);
            setToken(data.token);
            setUser(data);
            return data;
        }
        throw new Error(data.message || 'Registration Failed');
    };

    const logout = () => {
        localStorage.removeItem('hireguardToken'); // Nuke token
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
