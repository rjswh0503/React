import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import { Pin, Megaphone, ChevronRight } from 'lucide-react';

const ImportanceBoard = () => {
    const [importanceBoard, setImportanceBoard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoardList = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/board/importance');
                // 최신순 정렬 후 상위 5개만 표시 (대시보드용)
                const sortedData = response.data.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setImportanceBoard(sortedData.slice(0, 5));
            } catch (e) {
                console.error("공지사항 로드 실패:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchBoardList();
    }, []);

    return (
        <div className="w-full">
            {loading ? (
                <div className="py-10 text-center text-slate-400 text-sm font-medium animate-pulse">
                    공지사항을 불러오는 중...
                </div>
            ) : importanceBoard.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm font-medium">
                    등록된 중요 공지사항이 없습니다.
                </div>
            ) : (
                <ul className="flex flex-col">
                    {importanceBoard.map((board) => {
                        const date = new Date(board.createdAt);
                        const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

                        // 신규 게시물 판별 (3일 이내)
                        const now = new Date();
                        const diffTime = Math.abs(now - date);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        const isNew = diffDays <= 3;

                        return (
                            <li 
                                key={board.id}
                                className="group flex items-center justify-between p-3.5 rounded-2xl transition-all hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* 중요도 배지 */}
                                    {board.importance === 'HIGH' ? (
                                        <span className="shrink-0 px-2.5 py-0.5 bg-red-50 text-red-500 text-[10px] font-black rounded-lg border border-red-100">
                                            필독
                                        </span>
                                    ) : isNew ? (
                                        <span className="shrink-0 px-1.5 py-0.5 bg-blue-50 text-blue-500 text-[10px] font-black rounded-md">
                                            N
                                        </span>
                                    ) : (
                                        <Pin className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                    )}

                                    {/* 제목 */}
                                    <Link 
                                        to={`/dashboard1/board/${board.noticeId || board.id}`} 
                                        className="text-[14px] text-slate-700 font-bold truncate group-hover:text-blue-600 transition-colors"
                                    >
                                        {board.title}
                                    </Link>
                                </div>

                                {/* 날짜 */}
                                <span className="ml-4 text-[11px] text-slate-400 font-medium shrink-0 tabular-nums">
                                    {dateStr}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default ImportanceBoard;