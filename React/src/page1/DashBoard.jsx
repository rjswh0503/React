"use client"

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    Bell,
    CheckCircle2
} from "lucide-react";

// 컴포넌트 임포트
import EmployeeManagement from './admin/EmployeeManagement.jsx';
import DepartmentManagement from './admin/DepartmentManagement.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import Attendance from '../page1/attendance/Attendance.jsx';
import TaskList from '../page1/task/TaskList.jsx';
import ImportanceBoard from '../Components/dashBoardMain/ImportanceBoard.jsx';

function DashBoard() {
    const { user, logout, loading } = useAuth(); 
    const [activeMenu, setActiveMenu] = useState('home');
    const navigate = useNavigate();

    const today = new Date();
    const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
        </div>
    );

    if (!user) {
        navigate('/login');
        return null;
    }

    const isAdmin = user?.role === 'ADMIN';
    const isUser = user?.role === 'USER';

    // 메인 홈 대시보드 UI 컴포넌트
    const HomeDashboard = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* 상단 통계 카드 섹션 */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white p-6 rounded-3xl border border-slate-200 shadow-sm'>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Clock className="h-5 w-5" /></div>
                        <p className='text-xs text-slate-400 font-bold uppercase'>오늘 출근</p>
                    </div>
                    <p className='text-3xl font-black text-slate-900'>08:52</p>
                    <p className='text-[11px] text-emerald-500 font-bold mt-2'>● 정상 출근입니다.</p>
                </div>
                <div className='bg-white p-6 rounded-3xl border border-slate-200 shadow-sm'>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-50 rounded-xl text-orange-600"><Calendar className="h-5 w-5" /></div>
                        <p className='text-xs text-slate-400 font-bold uppercase'>잔여 연차</p>
                    </div>
                    <p className='text-3xl font-black text-slate-900'>12.5 <span className='text-lg font-bold text-slate-400'>일</span></p>
                </div>
                <div className='bg-white p-6 rounded-3xl border border-slate-200 shadow-sm'>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 rounded-xl text-purple-600"><FileBarChart className="h-5 w-5" /></div>
                        <p className='text-xs text-slate-400 font-bold uppercase'>이번 주 근무</p>
                    </div>
                    <p className='text-3xl font-black text-slate-900'>32h 15m</p>
                </div>
            </div>

            {/* 중간 섹션: 공지사항 & 할 일 */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm'>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className='font-black text-xl flex items-center gap-2'>
                            <Bell className="h-5 w-5 text-amber-500" /> 공지사항
                        </h3>
                        <Link to="/board/list" className='text-xs text-slate-400 hover:text-slate-900 font-bold transition-colors'>
                            더보기 +
                        </Link>
                    </div>
                    <ImportanceBoard />
                </div>

                <div className='bg-slate-50 p-8 rounded-[2rem] border border-slate-200 shadow-sm'>
                    <h3 className='font-black text-xl mb-6 flex items-center gap-2'>
                        <CheckCircle2 className="h-5 w-5 text-blue-500" /> 나의 할 일
                    </h3>
                    <div className='space-y-3'>
                        {['주간 보고서 작성', '오후 2시 클라이언트 미팅', '연차 신청 승인 확인'].map((task, i) => (
                            <div key={i} className='flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all'>
                                <input type="checkbox" className='w-5 h-5 rounded-full accent-blue-500 cursor-pointer border-slate-300' />
                                <span className='text-sm font-bold text-slate-700'>{task}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className='flex min-h-screen bg-[#F8F9FA] text-slate-900 font-sans'>
            
            {/* Sidebar: 왼쪽 고정 네비게이션 */}
            <aside className='w-72 bg-[#1A1C1E] text-white flex flex-col fixed inset-y-0 left-0 z-50 p-6 m-4 rounded-[2.5rem] shadow-2xl transition-all'>
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-xl font-black">W</div>
                    <h2 className='text-xl font-black tracking-tight uppercase'>WorkHub</h2>
                </div>

                <nav className='flex-1 space-y-1 overflow-y-auto no-scrollbar'>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] px-4 mb-4 italic">Overview</p>
                    
                    <MenuButton 
                        active={activeMenu === 'home'} 
                        onClick={() => setActiveMenu('home')}
                        icon={<LayoutDashboard className="h-5 w-5" />}
                        label="대시보드"
                    />

                    {isUser && (
                        <div className="space-y-1 pt-4">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] px-4 mb-4 italic">Personal</p>
                            <MenuButton 
                                active={activeMenu === 'manage-list'} 
                                onClick={() => setActiveMenu('manage-list')}
                                icon={<Clock className="h-5 w-5" />}
                                label="출퇴근 기록"
                            />
                            <MenuButton 
                                active={activeMenu === 'manage-task-schedule'} 
                                onClick={() => setActiveMenu('manage-task-schedule')}
                                icon={<Calendar className="h-5 w-5" />}
                                label="근무 일정"
                            />
                            <MenuButton 
                                active={activeMenu === 'manage-attendance-report'} 
                                onClick={() => setActiveMenu('manage-attendance-report')}
                                icon={<FileBarChart className="h-5 w-5" />}
                                label="근태 리포트"
                            />
                            <MenuButton 
                                active={activeMenu === 'manage-setting'} 
                                onClick={() => setActiveMenu('manage-setting')}
                                icon={<Settings className="h-5 w-5" />}
                                label="설정"
                            />
                        </div>
                    )}

                    {isAdmin && (
                        <div className="pt-8 space-y-1">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] px-4 mb-4 italic">Management</p>
                            <MenuButton 
                                active={activeMenu === 'manage-attendance'} 
                                onClick={() => setActiveMenu('manage-attendance')}
                                icon={<LayoutDashboard className="h-5 w-5 text-blue-400" />}
                                label="관리자 대시보드"
                            />
                            <MenuButton 
                                active={activeMenu === 'manage-employeeManagerment'} 
                                onClick={() => setActiveMenu('manage-employeeManagerment')}
                                icon={<Users className="h-5 w-5" />}
                                label="사원 관리"
                            />
                            <MenuButton 
                                active={activeMenu === 'manage-department'} 
                                onClick={() => setActiveMenu('manage-department')}
                                icon={<Building2 className="h-5 w-5" />}
                                label="부서 관리"
                            />
                        </div>
                    )}
                </nav>

                <button onClick={handleLogout} className='mt-auto flex items-center justify-center gap-2 py-4 bg-slate-800/50 hover:bg-red-500/10 hover:text-red-500 text-slate-400 rounded-2xl font-bold transition-all'>
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content: 오른쪽 스크롤 영역 */}
            <div className="flex-1 pl-[312px] pr-8 py-8 transition-all">
                {/* 상단 헤더 유닛 */}
                <header className='flex justify-between items-end mb-10 px-4'>
                    <div>
                        <p className='text-slate-400 font-bold text-sm mb-1'>{dateString}</p>
                        <h1 className='text-3xl font-black text-slate-900'>
                            {isAdmin ? '관리자님,' : `${user?.name} ${user?.position || '사원'}님,`} 
                            <span className="font-light text-slate-400 ml-2">반가워요! </span>
                        </h1>
                    </div>
                    {/* 상단 퀵 버튼 예시 */}
                    <div className="flex gap-3">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 text-slate-400 cursor-pointer hover:text-blue-500 transition-colors">
                            <Bell className="h-5 w-5" />
                        </div>
                    </div>
                </header>

                {/* 메뉴에 따른 컨텐츠 렌더링 */}
                <main className='min-h-[calc(100vh-200px)]'>
                    {activeMenu === 'home' && <HomeDashboard />}
                    {activeMenu === 'manage-attendance' && <AdminDashboard />}
                    {activeMenu === 'manage-employeeManagerment' && <EmployeeManagement/>}
                    {activeMenu === 'manage-department' && <DepartmentManagement/>}
                    {activeMenu === 'manage-task-schedule' && <TaskList user={user} />}
                    {activeMenu === 'manage-list' && <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm"><Attendance/></div>}
                </main>
            </div>
        </div>
    );
}

// 재사용 가능한 메뉴 버튼 컴포넌트
const MenuButton = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
        ${active 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}
    >
        <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
            {icon}
        </span>
        <span className="text-sm tracking-tight">{label}</span>
    </button>
);

export default DashBoard;