import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            navigate('/dashboard');
        }
        return response.data;
    };

    const signup = async (username, email, password, fullName) => {
        const response = await api.post('/auth/signup', { username, email, password, fullName });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
