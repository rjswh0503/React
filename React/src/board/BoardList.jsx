import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { Badge } from 'flowbite-react';


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


        }
        fetchBoardList();
    }, [])

    return (

        <>
            <div>
                <ul className='space-y-3'> {/* 간격을 살짝 좁히면 더 밀도 있어 보입니다 */}
                    {boardList.slice(0, 3).map(board => (
                        <li
                            key={board.id}
                            className='flex items-center justify-between px-4 py-2 text-sm group hover:bg-gray-50 rounded-lg transition-all'
                        >
                            {/* 왼쪽 영역: 태그 + 제목 */}
                            <div className='flex items-center gap-3 overflow-hidden'>
                                {(new Date() - new Date(board.createdAt)) < 24 * 60 * 60 * 1000 && (
                                    <span className='shrink-0 text-[12px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded'>
                                        NEW
                                    </span>
                                )}
                                
                                <Badge color="failure" className="shrink-0 text-[10px] px-1.5 py-0">
                                    중요
                                </Badge>

                                <span className='truncate text-gray-700 group-hover:text-blue-600 font-medium cursor-pointer'>
                                    <Link to={`/board/${board.noticeId}`}>{board.title}</Link>
                                </span>
                            </div>

                            {/* 오른쪽 영역: 날짜 + 직무(포지션) */}
                            <div className='flex items-center gap-4 shrink-0 ml-4'>
                                <span className='text-gray-400 text-xs'>
                                    {new Date(board.createdAt).toLocaleDateString('ko-KR').slice(0, -1)}
                                </span>
                                <span className='text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded-full'>
                                    {board.position}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </>
    )

}


export default BoardList;