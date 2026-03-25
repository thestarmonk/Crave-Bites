import { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/auth/profile');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const updatedUser = { ...data, token: userInfo?.token };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Failed to fetch profile', error);
        }
    };

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
            fetchProfile(); // Get latest role/data from server
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Welcome back!');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Account created successfully!');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
