import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Pin } from "lucide-react";

const BoardList = () => {
    const [boardList, setBoardList] = useState([]);

    useEffect(() => {
        const fetchBoardList = async () => {
            try {
                const response = await api.get('/api/board/list');
                setBoardList(response.data);
            } catch (e) {
                console.error("게시글 조회 실패:" + e);
            }
        };
        fetchBoardList();
    }, []);

    return (
        <div className='w-full max-w-3xl mx-auto'>
            <div className='mb-4'>
                <h1 className='text-2xl font-bold text-foreground tracking-tight'>공지사항</h1>

            </div>
        <div className='w-full max-w-5xl mx-auto py-10 px-4'>
            {/* 상단 테이블 헤더 */}
            <div className='grid grid-cols-[80px_1fr_120px] px-6 py-3 border-y border-gray-200 text-sm font-medium text-gray-500 bg-white'>
                <span>분류</span>
                <span>제목</span>
                <span className='text-right'>날짜</span>
            </div>

            {/* 리스트 본문 */}
            <div className='divide-y divide-gray-100 border-b border-gray-200'>
                {boardList.map((board) => (
                    <div 
                        key={board.id} 
                        className='grid grid-cols-[80px_1fr_120px] items-center px-6 py-4 hover:bg-gray-50 transition-colors group cursor-pointer'
                    >
                       {/* 분류 (Badge) */}
                        <div>
        <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold text-white rounded-full ${
            board.importance === 'HIGH' ? 'bg-red-500' : 'bg-blue-500'
        }`}>
            {board.importance === 'HIGH' ? '긴급' : '일반'}
        </span>
    </div>

                        {/* 제목 영역 */}
                        <div className='flex items-center gap-2 overflow-hidden'>
                            {/* 고정 아이콘 (조건부 렌더링 가능) */}
                            <Pin className='h-4 w-4 text-gray-400 shrink-0' />
                            
                            <span className='text-[15px] text-gray-800 truncate group-hover:text-black'>
                               <Link to={`/board/${board.noticeId}`}>{board.title}</Link>
                            </span>

                            {/* 신규 게시물 표시 (주황색 점) */}
                            {(new Date() - new Date(board.createdAt)) < 24 * 60 * 60 * 1000 && (
                                <span className='w-2 h-2 bg-orange-500 rounded-full shrink-0' title="New"></span>
                            )}
                        </div>

                        {/* 날짜 */}
                        <div className='text-right text-sm text-gray-400 font-light'>
                            {new Date(board.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).replace(/\. /g, '.').slice(0, -1)}
                        </div>
                    </div>
                ))}
            </div>

            {/* 하단 카운트 */}
            <div className='mt-4 text-center text-sm text-gray-500'>
                총 {boardList.length}건
            </div>
        </div>
        </div>
    );
};

export default BoardList;