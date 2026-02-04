import React, { useState, useEffect } from 'react';
import api from '../api/api';



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
                <ul className='space-y-1'>
                    {boardList.map(board => (

                        <li
                            key={board.id}
                            className='flex items-center justify-around text-sm group'
                        >
                            <div>
                                {(new Date() - new Date(board.createdAt)) < 24 * 60 * 60 * 1000 ? (
                                    <span className='text-red-500 text-xs font-bold bg-red-50 px-2 py-0.5 rounded'>
                                        최신
                                    </span>
                                ) : null}
                            </div>
                            <div>
                                <span className='text-gray-600 group-hover:text-blue-500 transition-colors cursor-pointer'>
                                    {board.title}
                                </span>
                            </div>
                            <div>
                                <span className='text-gray-600 text-xs'>
                                    {new Date(board.createdAt).toLocaleDateString('ko-KR')}
                                </span>
                            </div>
                            <div>
                                <span className='text-black text-xs'>
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