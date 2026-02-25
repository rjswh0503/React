import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../ui/NavBar';
import Sidebar from '../ui/Sidebar';
import { useAuth } from '../context/Auth';

const DashBoard1 = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* 1. 사이드바 고정 */}
            <Sidebar isAdmin={isAdmin} />

            {/* 2. 우측 메인 영역: ml-64 필수 */}
            <div className="flex-1 ml-64 flex flex-col min-w-0">
                <Navbar />

                {/* 3. 실제 컨텐츠 영역 */}
                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* URL 경로에 따라 MainContent, BoardList 등이 여기에 나타납니다 */}
                        <Outlet /> 
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashBoard1;