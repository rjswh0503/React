"use client"

import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/Auth.jsx';
import {
    LayoutDashboard,
    Clock,
    Calendar,
    FileBarChart,
    Settings,
    Users,
    Building2,
    LogOut,
    Bell
} from "lucide-react";

// 재사용 가능한 메뉴 버튼 컴포넌트
const MenuButton = ({ active, to, icon, label }) => (
    <Link
        to={to}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
        ${active
                ? 'bg-white text-black shadow-lg shadow-white/10 font-bold'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        <span className={`${active ? 'text-black' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`}>
            {icon}
        </span>
        <span className="text-sm tracking-tight">{label}</span>
    </Link>
);

function DashboardLayout() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const today = new Date();
    const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
        </div>
    );

    if (!user) {
        return null;
    }

    const isAdmin = user?.role === 'ADMIN';
    const isUser = user?.role === 'USER';

    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className='flex min-h-screen bg-[#F9FAFB] text-gray-900 font-sans'>

            {/* Sidebar: 왼쪽 고정 네비게이션 */}
            <aside className='w-72 bg-[#1A1C1E] text-white flex flex-col fixed inset-y-0 left-0 z-50 p-6 m-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all'>
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 bg-white text-black rounded-2xl flex items-center justify-center text-xl font-black">W</div>
                    <h2 className='text-xl font-black tracking-tight uppercase'>WorkHub</h2>
                </div>

                <nav className='flex-1 space-y-1 overflow-y-auto no-scrollbar'>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] px-4 mb-4 italic">Overview</p>

                    <MenuButton
                        active={isActive('/dashboard') && location.pathname === '/dashboard'}
                        to="/dashboard"
                        icon={<LayoutDashboard className="h-5 w-5" />}
                        label="대시보드"
                    />

                    <MenuButton
                        active={isActive('/dashboard/board')}
                        to="/dashboard/board/list"
                        icon={<Bell className="h-5 w-5" />}
                        label="공지사항"
                    />

                    {isUser && (
                        <div className="space-y-1 pt-4">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] px-4 mb-4 italic">Personal</p>
                            <MenuButton
                                active={isActive('/dashboard/attendance/records')}
                                to="/dashboard/attendance/records"
                                icon={<Clock className="h-5 w-5" />}
                                label="출퇴근 기록"
                            />
                            <MenuButton
                                active={isActive('/dashboard/task')}
                                to="/dashboard/task"
                                icon={<Calendar className="h-5 w-5" />}
                                label="근무 일정"
                            />
                            <MenuButton
                                active={isActive('/dashboard/attendance/report')}
                                to="/dashboard/attendance/report"
                                icon={<FileBarChart className="h-5 w-5" />}
                                label="근태 리포트"
                            />
                            <MenuButton
                                active={isActive('/dashboard/mypage')}
                                to="/dashboard/mypage"
                                icon={<Settings className="h-5 w-5" />}
                                label="설정"
                            />
                        </div>
                    )}

                    {isAdmin && (
                        <div className="pt-8 space-y-1">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] px-4 mb-4 italic">Management</p>
                            <MenuButton
                                active={isActive('/dashboard/admin')}
                                to="/dashboard/admin"
                                icon={<LayoutDashboard className="h-5 w-5" />}
                                label="관리자 대시보드"
                            />
                            <MenuButton
                                active={isActive('/dashboard/employees')}
                                to="/dashboard/employees"
                                icon={<Users className="h-5 w-5" />}
                                label="사원 관리"
                            />
                            <MenuButton
                                active={isActive('/dashboard/department')}
                                to="/dashboard/department"
                                icon={<Building2 className="h-5 w-5" />}
                                label="부서 관리"
                            />
                        </div>
                    )}
                </nav>

                <button onClick={handleLogout} className='mt-auto flex items-center justify-center gap-2 py-4 bg-gray-800/50 hover:bg-white hover:text-black text-gray-400 rounded-2xl font-bold transition-all'>
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content: 오른쪽 스크롤 영역 */}
            <div className="flex-1 pl-[312px] pr-8 py-8 transition-all">
                {/* 상단 헤더 유닛 */}
                <header className='flex justify-between items-end mb-10 px-4'>
                    <div>
                        <p className='text-gray-400 font-bold text-sm mb-1'>{dateString}</p>
                        <h1 className='text-3xl font-black text-gray-900'>
                            {isAdmin ? '관리자님,' : `${user?.name} ${user?.position || '사원'}님,`}
                            <span className="font-light text-gray-400 ml-2">반가워요! </span>
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-gray-400 cursor-pointer hover:text-black transition-colors">
                            <Bell className="h-5 w-5" />
                        </div>
                    </div>
                </header>

                {/* 라우팅 컨텐츠 */}
                <main className='min-h-[calc(100vh-200px)]'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
