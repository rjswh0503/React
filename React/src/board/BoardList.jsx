import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Megaphone, User, Calendar } from "lucide-react";
import api from '../api/api';
import { useAuth } from '../context/Auth';


const BoardList = () => {
    const [boardList, setBoardList] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        const fetchBoardList = async () => {
            try {
                const response = await api.get('/api/board/list');
                const data = response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setBoardList(data);
            } catch (e) {
                console.error("게시글 조회 실패:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchBoardList();
    }, []);

    return (
        <div className='mx-auto w-full max-w-4xl px-4 py-8 relative'>
            {/* 상단 네비게이션 및 타이틀 */}
            <div className='mb-6 flex items-center justify-between'>
                <div>
                    <Link
                        to="/dashboard1"
                        className='mb-4 inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-900'
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        대시보드로 돌아가기
                    </Link>
                    <h1 className='text-2xl font-bold tracking-tight text-gray-900'>공지사항</h1>
                </div>
            </div>

            {/* 카드 컨테이너 */}
            <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
                {/* 카드 헤더 */}
                <div className='flex border-b border-gray-100 px-6 py-5 bg-white'>
                    <h2 className='text-lg font-bold text-gray-900'>전체 공지 목록</h2>
                    {isAdmin && (
                        <Link
                            to="/dashboard1/board/add"
                            className="px-5 py-2.5 bg-white text-slate-700 rounded-xl font-bold text-sm border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                        >
                            글쓰기
                        </Link>
                    )}
                </div>

                {/* 리스트 본문 */}
                <div className='p-6'>
                    {loading ? (
                        <div className="py-10 text-center text-sm text-gray-500">로딩 중...</div>
                    ) : boardList.length === 0 ? (
                        <div className="py-10 text-center text-sm text-gray-500">등록된 공지사항이 없습니다.</div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {boardList.map((board) => {
                                const date = new Date(board.createdAt);
                                const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

                                const now = new Date();
                                const diffTime = Math.abs(now.getTime() - date.getTime());
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                const isNew = diffDays <= 3;
                                const isHigh = board.importance === 'HIGH';

                                return (
                                    <Link
                                        key={board.id}
                                        to={`/dashboard1/board/${board.noticeId}`}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                                    >
                                        <div className="flex items-start gap-4 overflow-hidden">
                                            {/* 좌측 아이콘 (PC에서만 표시) */}
                                            <div className="mt-1 hidden shrink-0 rounded-full bg-blue-50 p-2 sm:block transition-colors group-hover:bg-blue-100">
                                                <Megaphone className="h-4 w-4 text-blue-600" />
                                            </div>

                                            <div className="flex flex-col gap-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {isNew && (
                                                        <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                                                            NEW
                                                        </span>
                                                    )}
                                                    <span className={`rounded px-2 py-0.5 text-xs font-bold ${isHigh ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {isHigh ? '필독' : '공지'}
                                                    </span>
                                                    <h3 className="truncate font-semibold text-base text-gray-900 group-hover:underline group-hover:underline-offset-4">
                                                        {board.title}
                                                    </h3>
                                                </div>

                                                {/* 내용 미리보기 (2줄 이상 말줄임표 처리) */}
                                                <p className="line-clamp-2 text-sm text-gray-500 mt-1">
                                                    {board.content}
                                                </p>

                                                {/* 모바일 화면용 작성자 및 날짜 정보 */}
                                                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 sm:hidden">
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {board.position || '관리자'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {dateStr}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* PC 화면용 우측 작성자 및 날짜 정보 */}
                                        <div className="hidden shrink-0 flex-col items-end gap-1.5 min-w-[100px] text-sm text-gray-400 sm:flex">
                                            <div className="flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5" />
                                                {board.position || '관리자'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {dateStr}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BoardList;