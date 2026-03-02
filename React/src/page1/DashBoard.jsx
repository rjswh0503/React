"use client"

import React, { useState, useEffect } from 'react';
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
import AttendanceRecords from '../Components/dashBoardMain/Attendance.jsx';
import AttendanceCharts from './attendance/Attendance.jsx';
import TaskList from './TaskList.jsx';
import ImportanceBoard from '../Components/dashBoardMain/ImportanceBoard.jsx';
import BoardList from '../board/BoardList.jsx';
import Setting from './Setting.jsx';
import api from '../api/api.jsx';

// 메인 홈 대시보드 UI 컴포넌트 (외부 추출)
const HomeDashboard = ({ todayAttendance, recentTasks, handleCheckIn, handleCheckOut, setActiveMenu }) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* 상단 통계 카드 섹션 */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:scale-[1.02] transition-transform'>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Clock className="h-5 w-5" /></div>
                    <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>오늘 출근</p>
                </div>
                <p className='text-3xl font-black text-gray-900'>{todayAttendance?.checkInTime || "--:--"}</p>
                <p className={`text-[11px] font-bold mt-2 ${todayAttendance?.status === 'NORMAL' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    ● {todayAttendance ? (todayAttendance.status === 'NORMAL' ? '정상 출근' : '지각/미등록') : '출근 전입니다.'}
                </p>
            </div>
            <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:scale-[1.02] transition-transform'>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-50 rounded-xl text-orange-600"><Calendar className="h-5 w-5" /></div>
                    <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>퇴근 시간</p>
                </div>
                <p className='text-3xl font-black text-gray-900'>{todayAttendance?.checkOutTime || "--:--"}</p>
                <p className='text-[11px] text-gray-400 font-bold mt-2'>오늘 퇴근 정보</p>
            </div>
            <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:scale-[1.02] transition-transform col-span-1 md:col-span-2 flex flex-col justify-center'>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className='text-xs text-gray-400 font-bold uppercase tracking-wider mb-2'>근태 Quick 액션</p>
                        <div className="flex gap-2">
                            <button onClick={handleCheckIn} disabled={!!todayAttendance?.checkInTime}
                                className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${!!todayAttendance?.checkInTime ? 'bg-gray-100 text-gray-300' : 'bg-black text-white hover:bg-gray-800 shadow-lg'}`}>
                                출근하기
                            </button>
                            <button onClick={handleCheckOut} disabled={!todayAttendance?.checkInTime || !!todayAttendance?.checkOutTime}
                                className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${(!todayAttendance?.checkInTime || !!todayAttendance?.checkOutTime) ? 'bg-gray-100 text-gray-300' : 'bg-white border border-gray-200 text-black hover:bg-gray-50'}`}>
                                퇴근하기
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:block text-right">
                        <p className='text-[10px] text-gray-400 font-bold uppercase'>Work Progress</p>
                        <p className='text-xl font-black'>{todayAttendance?.checkInTime ? '근무 중' : '휴식 중'}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* 중간 섹션: 공지사항 & 할 일 */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)]'>
                <div className="flex justify-between items-center mb-6">
                    <h3 className='font-black text-xl flex items-center gap-2 text-gray-900'>
                        <Bell className="h-5 w-5 text-amber-500" /> 공지사항
                    </h3>
                    <button onClick={() => setActiveMenu('manage-board')} className='text-xs text-gray-400 hover:text-gray-900 font-bold transition-colors'>
                        더보기 +
                    </button>
                </div>
                <ImportanceBoard />
            </div>

            <div className='bg-gray-50/50 p-8 rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)]'>
                <h3 className='font-black text-xl mb-6 flex items-center gap-2 text-gray-900'>
                    <CheckCircle2 className="h-5 w-5 text-blue-500" /> 나의 업무
                </h3>
                <div className='space-y-3'>
                    {recentTasks.length > 0 ? recentTasks.map((task, index) => (
                        <div key={task.id || `task-${index}`} className='flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-black/5 transition-all group'>
                            <div className={`w-2 h-10 rounded-full ${task.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                            <div className="flex-1">
                                <p className={`text-sm font-bold text-gray-700 group-hover:text-black transition-colors ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                                <p className='text-[10px] text-gray-400 font-bold'>{task.dueDate}</p>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-lg font-black ${task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {task.status}
                            </span>
                        </div>
                    )) : (
                        <div className="text-center py-10 text-gray-400 font-bold text-sm bg-white rounded-3xl border border-dashed border-gray-200">
                            예정된 업무가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);

function DashBoard() {
    const { user, logout, loading } = useAuth();
    const [activeMenu, setActiveMenu] = useState('home');
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
        if (user && activeMenu === 'home') {
            fetchDashboardStats();
        }
    }, [user, activeMenu]);

    const fetchDashboardStats = async () => {
        try {
            setLoadingData(true);
            const [attRes, taskRes] = await Promise.all([
                api.get('/api/attendance/today'),
                api.get('/api/task')
            ]);

            if (attRes.data && typeof attRes.data === 'object') {
                setTodayAttendance(attRes.data);
            } else {
                setTodayAttendance(null);
            }

            if (Array.isArray(taskRes.data)) {
                setRecentTasks(taskRes.data.slice(0, 3));
            }
        } catch (error) {
            console.error("대시보드 데이터 로드 실패:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            await api.post('/api/attendance/check-in');
            alert("출근 처리가 완료되었습니다.");
            fetchDashboardStats();
        } catch (error) {
            alert(error.response?.data || "출근 처리 중 오류가 발생했습니다.");
        }
    };

    const handleCheckOut = async () => {
        try {
            await api.post('/api/attendance/check-out');
            alert("퇴근 처리가 완료되었습니다.");
            fetchDashboardStats();
        } catch (error) {
            alert(error.response?.data || "퇴근 처리 중 오류가 발생했습니다.");
        }
    };

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
                                active={activeMenu === 'manage-board'}
                                onClick={() => setActiveMenu('manage-board')}
                                icon={<Bell className="h-5 w-5" />}
                                label="공지사항"
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
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] px-4 mb-4 italic">Management</p>
                            <MenuButton
                                active={activeMenu === 'manage-attendance'}
                                onClick={() => setActiveMenu('manage-attendance')}
                                icon={<LayoutDashboard className="h-5 w-5" />}
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
                    {/* 상단 퀵 버튼 예시 */}
                    <div className="flex gap-3">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-gray-400 cursor-pointer hover:text-black transition-colors">
                            <Bell className="h-5 w-5" />
                        </div>
                    </div>
                </header>

                {/* 메뉴에 따른 컨텐츠 렌더링 */}
                <main className='min-h-[calc(100vh-200px)]'>
                    {activeMenu === 'home' && (
                        <HomeDashboard
                            todayAttendance={todayAttendance}
                            recentTasks={recentTasks}
                            handleCheckIn={handleCheckIn}
                            handleCheckOut={handleCheckOut}
                            setActiveMenu={setActiveMenu}
                        />
                    )}
                    {activeMenu === 'manage-attendance' && <AdminDashboard />}
                    {activeMenu === 'manage-employeeManagerment' && <EmployeeManagement />}
                    {activeMenu === 'manage-department' && <DepartmentManagement />}
                    {activeMenu === 'manage-task-schedule' && <div className="bg-white rounded-[2rem] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"><TaskList user={user} /></div>}
                    {activeMenu === 'manage-list' && <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"><AttendanceRecords /></div>}
                    {activeMenu === 'manage-attendance-report' && <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-4"><AttendanceCharts /></div>}
                    {activeMenu === 'manage-board' && <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-4"><BoardList /></div>}
                    {activeMenu === 'manage-setting' && <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)]"><Setting /></div>}
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
                ? 'bg-white text-black shadow-lg shadow-white/10 font-bold'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        <span className={`${active ? 'text-black' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`}>
            {icon}
        </span>
        <span className="text-sm tracking-tight">{label}</span>
    </button>
);

export default DashBoard;