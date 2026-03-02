import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth.jsx';
import {
    Clock,
    Calendar,
    Bell,
    CheckCircle2,
    LogIn,
    LogOut,
    Activity
} from "lucide-react";
import ImportanceBoard from '../Components/dashBoardMain/ImportanceBoard.jsx';
import api from '../api/api.jsx';

const HomeDashboard = () => {
    const { user } = useAuth();
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const navigate = useNavigate();

    const [ticker, setTicker] = useState(0);

    useEffect(() => {
        if (user) {
            fetchDashboardStats();
            const pollId = setInterval(fetchDashboardStats, 10000);
            const tickerId = setInterval(() => setTicker(t => t + 1), 1000);
            return () => {
                clearInterval(pollId);
                clearInterval(tickerId);
            };
        }
    }, [user]);

    const calculateElapsedTime = (checkInTime) => {
        if (!checkInTime) return "";
        try {
            const [h, m, s] = checkInTime.split(':').map(Number);
            const checkInDate = new Date();
            checkInDate.setHours(h, m, s || 0, 0);
            const diffMs = new Date() - checkInDate;
            if (diffMs <= 0) return "";
            const totalMin = Math.floor(diffMs / (1000 * 60));
            return ` (${Math.floor(totalMin / 60)}h ${totalMin % 60}m)`;
        } catch (e) { return ""; }
    };

    const fetchDashboardStats = async () => {
        try {
            const [attRes, taskRes] = await Promise.all([
                api.get('/api/attendance/today'),
                api.get('/api/task')
            ]);
            setTodayAttendance(attRes.data && typeof attRes.data === 'object' ? attRes.data : null);
            if (Array.isArray(taskRes.data)) setRecentTasks(taskRes.data.slice(0, 3));
        } catch (error) {
            console.error("대시보드 데이터 로드 실패:", error);
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* 상단 통계 카드 섹션 */}
            {/* 상단 통계 카드 섹션 */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* 오늘 출근 */}
                <div className='bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[220px]'>
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Clock className="h-5 w-5" /></div>
                            <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>오늘 출근</p>
                        </div>
                        <p className='text-4xl font-black text-gray-900 tracking-tighter leading-none'>{todayAttendance?.checkInTime || "--:--"}</p>
                    </div>
                    <p className={`text-[12px] font-bold mt-2 ${todayAttendance?.status === 'NORMAL' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        ● {todayAttendance ? (todayAttendance.status === 'NORMAL' ? '정상 출근' : '지각/미등록') : '출근 전'}
                    </p>
                </div>

                {/* 퇴근 시간 */}
                <div className='bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[220px]'>
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-orange-50 rounded-xl text-orange-600"><Calendar className="h-5 w-5" /></div>
                            <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>퇴근 시간</p>
                        </div>
                        <p className='text-4xl font-black text-gray-900 tracking-tighter leading-none'>{todayAttendance?.checkOutTime || "--:--"}</p>
                    </div>
                    <p className='text-[12px] text-gray-400 font-bold mt-2'>오늘의 업무 마무리 시간</p>
                </div>

                {/* 근태 Quick 액션 */}
                <div className='bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[220px] overflow-hidden'>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                <Activity className="h-4 w-4" />
                            </div>
                            <p className='text-[11px] text-gray-400 font-bold uppercase tracking-wider'>근태 Quick</p>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${todayAttendance?.checkInTime && !todayAttendance?.checkOutTime ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                            {todayAttendance?.checkInTime && !todayAttendance?.checkOutTime ? 'Working' : 'Idle'}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handleCheckIn}
                                disabled={!!todayAttendance?.checkInTime}
                                className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-bold transition-all ${!!todayAttendance?.checkInTime
                                    ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800 shadow-lg active:scale-95'
                                    }`}
                            >
                                <LogIn className="h-3.5 w-3.5" />
                                출근
                            </button>
                            <button
                                onClick={handleCheckOut}
                                disabled={!todayAttendance?.checkInTime || !!todayAttendance?.checkOutTime}
                                className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-bold transition-all ${(!todayAttendance?.checkInTime || !!todayAttendance?.checkOutTime)
                                    ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                                    : 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 active:scale-95'
                                    }`}
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                퇴근
                            </button>
                        </div>

                        <div className="flex items-center justify-between px-1 pt-3 border-t border-slate-50">
                            <p className='text-[9px] text-gray-400 font-black uppercase tracking-tight'>Work Progress</p>
                            <p className={`text-xs font-black italic ${todayAttendance?.checkInTime && !todayAttendance?.checkOutTime ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {todayAttendance?.checkInTime
                                    ? (todayAttendance.checkOutTime
                                        ? '퇴근됨'
                                        : `근무 중${calculateElapsedTime(todayAttendance.checkInTime)}`)
                                    : '대기 중'}
                            </p>
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
                        <button onClick={() => navigate('/dashboard/board/list')} className='text-[11px] bg-slate-50 px-3 py-1.5 rounded-xl text-gray-400 hover:text-gray-900 font-black transition-colors border border-transparent hover:border-slate-200'>
                            전체조회 +
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
};

export default HomeDashboard;
