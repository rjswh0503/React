import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Textarea, TextInput } from 'flowbite-react';
import { Select } from 'flowbite-react';
import { Button } from 'flowbite-react';
import { HiSpeakerphone } from 'react-icons/hi';


const BoardAdd = () => {
    const navigate = useNavigate();
    const [board, setBoard] = useState({
        title: '',
        content: '',
        importance: '',
    });


    const handleChange = (e) => {
        setBoard({
            ...board,
            [e.target.name]: e.target.value
        });
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!board.title || !board.content) {
            alert("제목과 내용은 필수입니다.");
            return;
        }
        try {
            await api.post("/api/board/add", board);
            alert("게시글 등록 완료");
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("등록 실패: " + (e.response?.data || "오류 발생"));
        }
    };

    return (
        <div className='min-h-screen bg-[#F9FAFB] flex flex-col items-center py-12 px-4'>
            <div className='w-full max-w-3xl'>
                <div className='mb-10'>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3 flex items-center">
                        <HiSpeakerphone className="mr-4 text-blue-600" /> 공지사항 등록
                    </h1>
                </div>
                <div className='bg-white border border-gray-100 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden'>
                    <div className='p-10 md:p-12'>
                        <div className='grid grid-cols-1 md:grid-cols-1 gap-x-10 gap-y-8'>
                            <form onSubmit={handleAdd}>  
                                <label>제목</label>
                                <TextInput type="text" name="title" value={board.title} onChange={handleChange} />

                                <label>내용</label>
                                <Textarea className='whiteSpace:pre-wrap' name="content" value={board.content} onChange={handleChange} required rows={10} />

                                <label>중요도</label>
                                <Select name="importance" value={board.importance} onChange={handleChange}>
                                    <option value="">선택</option>
                                    <option value="HIGH">높음</option>
                                    <option value="NORMAL">중간</option>
                                    <option value="LOW">낮음</option>
                                </Select>
                                <div className='max-w-md'>
                                    <Button color="green" className='font-bold mt-6' type="submit">등록</Button>  {/* ← onSubmit 제거 */}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardAdd;