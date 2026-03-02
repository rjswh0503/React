import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api.jsx';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => { // 이름을 AuthProvider로 통일하겠습니다.
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
                const res = await api.get('/api/check-login');
                const updatedUser = savedUser
                    ? { ...JSON.parse(savedUser), ...res.data }
                    : res.data;

                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } catch (error) {
                setUser(null);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };
        checkLoginStatus();
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try { await api.post('/api/logout'); } catch (err) { }
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// ★ 중요: 이 부분이 export 되어야 Home.jsx에서 'useAuth'를 찾을 수 있습니다.
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;