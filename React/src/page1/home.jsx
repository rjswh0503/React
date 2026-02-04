import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Register from './register';
import Employee from '../Components/Employee.jsx';
import BoardList from '../board/boardList.jsx';
import AttendancePanel from '../Components/AttendancePanel.jsx';

function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState('home'); // 현재 활성화된 메뉴 (home, attendance, profile, etc.)
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
        } catch (err) { navigate('/login'); }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#F6F6F6]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );

    const isAdmin = user?.role === 'ADMIN';
    const isUser = user?.role === 'USER';

    // 메인 홈 화면 컴포넌트
    const HomeDashboard = () => (
        <div className="space-y-6">
            <div className='grid grid-cols-3 gap-6'>
                {/* 내 근태 요약 */}
                <div className='bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm'>
                    <p className='text-xs text-gray-400 font-bold uppercase mb-4'>오늘 출근</p>
                    <p className='text-3xl font-black text-blue-500'>08:52</p>
                    <p className='text-[11px] text-gray-400 mt-2'>정상 출근입니다.</p>
                </div>
                {/* 잔여 연차 */}
                <div className='bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm'>
                    <p className='text-xs text-gray-400 font-bold uppercase mb-4'>잔여 연차</p>
                    <p className='text-3xl font-black text-gray-800'>12.5 <span className='text-lg'>일</span></p>
                </div>
                {/* 근무 시간 */}
                <div className='bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm'>
                    <p className='text-xs text-gray-400 font-bold uppercase mb-4'>이번 주 근무</p>
                    <p className='text-3xl font-black text-gray-800'>32h 15m</p>
                </div>
            </div>

            <div className='grid grid-cols-2 gap-6'>
                {/* 공지사항 카드 */}
                <div className='bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm'>
                    
                    <div className="flex justify-between items-center mb-6">
                        <h3 className='font-black text-lg'>공지사항</h3>
                        <button className='text-xs text-gray-400 hover:text-gray-600 font-bold'>
                            <Link to={"/board/list"}>더보기 +</Link>
                        </button>
                    </div>

                    {/* 게시글 리스트 (flex 밖으로 분리) */}
                    <div>
                        <BoardList className='space-y-4' />
                    </div>
                </div>

                {/* 내 할 일 (To-do) 카드 */}
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
            </div>
        </div>
    );

    return (
        <div className='flex min-h-screen bg-[#E9ECEF] font-sans p-4 gap-4'>
            {/* 1. 사이드바 - 빨간색 제거 세련된 디자인 */}
            <aside className='w-[280px] bg-[#212529] text-white p-8 flex flex-col rounded-[32px] shadow-2xl'>
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-10 h-10 bg-[#343A40] rounded-xl flex items-center justify-center text-lg font-bold text-blue-400">H</div>
                    <h2 className='text-xl font-bold tracking-tight'>HR System</h2>
                </div>

                <nav className='flex-1 space-y-2'>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] px-4 mb-4 italic">Overview</p>
                    <button onClick={() => setActiveMenu('home')}
                        className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'home' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                        대시보드 홈
                    </button>
                    {isUser && (
                        <button onClick={() => setActiveMenu('attendance')}
                            className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'attendance' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                            내 근태 현황
                        </button>
                    )}
                    {!isAdmin && (
                        <button onClick={() => setActiveMenu('profile')}
                            className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'profile' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                            내 정보
                        </button>
                    )}

                    {isAdmin && (
                        <div className="pt-8 space-y-2">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] px-4 mb-4 italic">Management</p>
                            <button onClick={() => setActiveMenu('manage-users')}
                                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'manage-users' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                사원 목록
                            </button>
                            <button onClick={() => setActiveMenu('manage-attendance')}
                                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'manage-attendance' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                사원 근태 조회
                            </button>
                            <button onClick={() => setActiveMenu('manage-register')}
                                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${activeMenu === 'manage-register' ? 'bg-[#343A40] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                사원 등록
                            </button>
                        </div>
                    )}
                </nav>

                <button onClick={handleLogout} className='mt-auto py-4 bg-[#343A40] hover:bg-gray-700 text-gray-300 hover:text-white rounded-2xl font-bold transition-all'>
                    Logout
                </button>
            </aside>

            {/* 2. 메인 컨텐츠 영역 */}
            <main className='flex-1 p-10 overflow-y-auto bg-white rounded-[32px] shadow-xl relative'>
                <header className='mb-10'>
                    <p className='text-gray-400 font-semibold mb-1'>{dateString}</p>
                    <h1 className='text-3xl font-black text-[#212529]'>
                        {isAdmin ? '관리자님,' : `${user?.name} ${user?.position || '사원'}님,`} <span className="font-light text-gray-500">반가워요! 👋</span>
                    </h1>
                </header>

                {/* 메뉴 클릭에 따른 컨텐츠 전환 */}
                {activeMenu === 'home' && <HomeDashboard />}

                {activeMenu === 'attendance' && (
                    <div className="bg-[#F8F9FA] p-8 rounded-[32px]">
                      <AttendancePanel/>
                    </div>
                )}

                {activeMenu === 'profile' && (
                    <div className="bg-[#F8F9FA] p-8 rounded-[32px]">
                        <h2 className="text-xl font-black mb-6">내 정보 수정</h2>
                        <div className="max-w-md space-y-4">
                            <div><label className="text-xs font-bold text-gray-400 block mb-2">이름</label><input type="text" className="w-full p-4 rounded-2xl bg-white border-none shadow-sm" defaultValue={user?.name} /></div>
                            <div><label className="text-xs font-bold text-gray-400 block mb-2">새 비밀번호</label><input type="password" className="w-full p-4 rounded-2xl bg-white border-none shadow-sm" placeholder="••••••••" /></div>
                            <button className="w-full py-4 bg-[#101112] hover:bg-[#212529] text-white rounded-2xl font-bold mt-4 shadow-lg hover:cursor-pointer">정보 저장하기</button>
                        </div>
                    </div>
                )}

                {activeMenu === 'manage-users' && (
                    <div className="bg-[#F8F9FA] p-8 rounded-[32px]">
                        <h2 className="text-xl font-black mb-6 text-blue-600">사원 목록</h2>
                        <div>
                            <Employee />
                        </div>

                    </div>
                )}

                {activeMenu === 'manage-attendance' && (
                    <div className="bg-[#F8F9FA] p-8 rounded-[32px]">
                        <h2 className="text-xl font-black mb-6 text-blue-600">전체 사원 근태 조회 (Admin)</h2>

                        {/* 관리자 전용 확장 테이블 자리 */}
                    </div>
                )}

                {activeMenu === 'manage-register' && (
                    <div className="bg-[#F8F9FA] p-8 rounded-[32px]">
                        <h2 className="text-xl font-black mb-6 text-blue-600">사원 등록
                        </h2>

                        <div>
                            <Register />
                        </div>
                    </div>
                )}


            </main>
        </div>
    );
}

export default Home;