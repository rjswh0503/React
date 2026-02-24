import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth.jsx'; 
import Employee from '../Components/Employee.jsx';
import Attendance from '../page1/attendance/Attendance.jsx';
import BoardAdd from '../board/BoardAdd.jsx';
import TaskCreate from './TaskCreate.jsx';
import TaskList from './TaskList.jsx';
import ImportanceBoard from '../board/ImportanceBoard.jsx';
// 1. 작성하신 AdminDashboard 컴포넌트를 import 합니다.
import AdminDashboard from './admin/AdminDashboard.jsx'; 
import EmployeeManagement from './admin/EmployeeManagement.jsx';
import DepartmentManagement from './admin/DepartmentManagement.jsx';

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
        <div className="flex items-center justify-center min-h-screen bg-[#F6F6F6]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );

    if (!user) {
        navigate('/login');
        return null;
    }

    const isAdmin = user?.role === 'ADMIN';
    const isUser = user?.role === 'USER';

    const HomeDashboard = () => (
        <div className="space-y-6">
            <div className='grid grid-cols-3 gap-6'>
                <div className='bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm'>
                    <p className='text-xs text-gray-400 font-bold uppercase mb-4'>오늘 출근</p>
                    <p className='text-3xl font-black text-blue-500'>08:52</p>
                    <p className='text-[11px] text-gray-400 mt-2'>정상 출근입니다.</p>
                </div>
                <div className='bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm'>
                    <p className='text-xs text-gray-400 font-bold uppercase mb-4'>잔여 연차</p>
                    <p className='text-3xl font-black text-gray-800'>12.5 <span className='text-lg'>일</span></p>
                </div>
                <div className='bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm'>
                    <p className='text-xs text-gray-400 font-bold uppercase mb-4'>이번 주 근무</p>
                    <p className='text-3xl font-black text-gray-800'>32h 15m</p>
                </div>
            </div>

            <div className='grid grid-cols-2 gap-6'>
                <div className='bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm'>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className='font-black text-lg'>공지사항</h3>
                        <button className='text-xs text-gray-400 hover:text-gray-600 font-bold'>
                            <Link to={"/board/list"}>더보기 +</Link>
                        </button>
                    </div>
                    <div>
                        <ImportanceBoard className='space-y-4' />
                    </div>
                </div>

                <div className='bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100 shadow-sm'>
                    <h3 className='font-black text-lg mb-6'>나의 할 일</h3>
                    <div className='space-y-3'>
                        {['주간 보고서 작성', '오후 2시 클라이언트 미팅', '연차 신청 승인 확인'].map((task, i) => (
                            <div key={i} className='flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm'>
                                <input type="checkbox" className='w-4 h-4 rounded-full accent-blue-500 cursor-pointer' />
                                <span className='text-sm font-medium text-gray-700'>{task}</span>
                            </div>
                        ))}
                    </div>
                </div>
               <div className='bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100 shadow-sm col-span-2'>
                  <h3 className='font-black text-lg mb-6'>사원 목록</h3>
                  <div className='space-y-6'>
                    <div className="overflow-x-auto">
                      <Employee />
                    </div>
                  </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className='flex min-h-screen bg-[#E9ECEF] font-sans p-4 gap-4'>
            {/* Sidebar 섹션 */}
            <aside className='w-[280px] bg-[#212529] text-white p-8 flex flex-col rounded-[32px] shadow-2xl'>
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-10 h-10 bg-[#343A40] rounded-xl flex items-center justify-center text-lg font-bold text-blue-400">H</div>
                    <h2 className='text-xl font-bold tracking-tight'>HR System</h2>
                </div>

                <nav className='flex-1 space-y-2'>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] px-4 mb-4 italic">Overview</p>
                    <button onClick={() => setActiveMenu('home')}
                        className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'home' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                        대시보드
                    </button>
                    <button onClick={() => setActiveMenu('manage-list')}
                         className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'manage-tasks' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                         출퇴근 기록
                    </button>
                    <button onClick={() => setActiveMenu('manage-task-schedule')}
                         className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'manage-task-list' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                        근무 일정
                    </button>
                    <button onClick={() => setActiveMenu('manage-attendance-report')}
                         className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'manage-task-list' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                        근태 리포트
                    </button>
                    <button onClick={() => setActiveMenu('manage-setting')}
                         className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'manage-task-list' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                        설정
                    </button>
                    {isUser && (
                        <div>
                        <button onClick={() => setActiveMenu('attendance')}
                            className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'attendance' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                            내 근태 현황
                        </button>
                        <button onClick={() => setActiveMenu('profile')}
                            className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'profile' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                            내 정보
                        </button>
                        </div>
                    )}

                    {isAdmin && (
                        <div className="pt-8 space-y-2">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] px-4 mb-4 italic">Management</p>
                            {/* 2. 관리자 대시보드 클릭 시 상태 업데이트 */}
                            <button onClick={() => setActiveMenu('manage-attendance')}
                                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'manage-attendance' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                    관리자 대시보드
                            </button>
                            <button onClick={() => setActiveMenu('manage-employeeManagerment')}
                                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'manage-employeeManagerment' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                    사원 관리
                            </button>
                            <button onClick={() => setActiveMenu('manage-department')}
                                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'manage-department' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                    부서 관리
                            </button>
                        </div>
                    )}
                </nav>

                <button onClick={handleLogout} className='mt-auto py-4 bg-[#343A40] hover:bg-gray-700 text-gray-300 hover:text-white rounded-2xl font-bold transition-all'>
                    Logout
                </button>
            </aside>

            {/* Main Content 섹션 */}
            <main className='flex-1 p-10 overflow-y-auto bg-white rounded-[32px] shadow-xl relative'>
                <header className='mb-10'>
                    <p className='text-gray-400 font-semibold mb-1'>{dateString}</p>
                    <h1 className='text-3xl font-black text-[#212529]'>
                        {isAdmin ? '관리자님,' : `${user?.name} ${user?.position || '사원'}님,`} <span className="font-light text-gray-500">반가워요! </span>
                    </h1>
                </header>

                {/* 3. 메뉴 조건부 렌더링에 관리자 대시보드 추가 */}
                {activeMenu === 'home' && <HomeDashboard />}
                {activeMenu === 'manage-attendance' && <AdminDashboard />}
                {activeMenu === 'manage-employeeManagerment' && <EmployeeManagement/>}
                {activeMenu === 'manage-department' && <DepartmentManagement/>}

                {activeMenu === 'manage-list' && <div className="bg-[#F8F9FA] p-8 rounded-[32px]"><Attendance/></div>}
                {activeMenu === 'profile' && (
                    <div className="bg-[#F8F9FA] p-8 rounded-[32px]">
                        <h2 className="text-xl font-black mb-6">내 정보 수정</h2>
                        <div className="max-w-md space-y-4">
                            <div><label className="text-xs font-bold text-gray-400 block mb-2">이름</label><input type="text" className="w-full p-4 rounded-2xl bg-white border-none shadow-sm" defaultValue={user?.name} /></div>
                            <div><label className="text-xs font-bold text-gray-400 block mb-2">새 비밀번호</label><input type="password" className="w-full p-4 rounded-2xl bg-white border-none shadow-sm" placeholder="••••••••" /></div>
                            <button className="w-full py-4 bg-[#101112] hover:bg-[#212529] text-white rounded-2xl font-bold mt-4 shadow-lg">정보 저장하기</button>
                        </div>
                    </div>
                )}
                {activeMenu === 'manage-notices' && <div className="bg-[#F8F9FA] p-8 rounded-[32px]"><BoardAdd/></div>}
                {activeMenu === 'manage-tasks' && <div className="bg-[#F8F9FA] p-8 rounded-[32px]"><h2 className="text-xl font-black mb-6 text-blue-600">업무 등록</h2><TaskCreate user={user}/></div>}
                {activeMenu === 'manage-task-list' && <div className="bg-[#F8F9FA] p-8 rounded-[32px]"><h2 className="text-xl font-black mb-6 text-blue-600">업무 목록</h2><TaskList user={user}/></div>}
            </main>
        </div>
    );
}

export default DashBoard;