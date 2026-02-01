import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';



const adminPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('record');
    const navigate = useNavigate();

    const today = new Date();
    const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

    useEffect(() => {
        api.get('/api/check-login')
            .then(res => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(() => {
                alert("로그인이 필요합니다.");
                navigate('/login');
            });
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await api.post('/api/logout');
            navigate('/login');
        } catch (err) {
            navigate('/login');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F6F6F6]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">로딩 중....</p>
        </div>
    );

    return (
        <div>
            
        </div>
    )

}

export default adminPage;


