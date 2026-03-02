import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
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
            navigate('/dashboard/board/list');
        } catch (e) {
            console.error(e);
            alert("등록 실패: " + (e.response?.data || "오류 발생"));
        }
    };

    return (
        <div className='min-h-screen bg-[#F9FAFB] flex flex-col items-center py-12 px-4'>
            <div className='w-full max-w-3xl'>
                {/* 헤더 섹션 */}
                <div className='mb-10'>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3 flex items-center">
                        <HiSpeakerphone className="mr-4 text-blue-600" /> 공지사항 등록
                    </h1>
                    <p className="text-gray-500 font-medium">전사 구성원에게 알릴 새로운 소식을 작성합니다.</p>
                </div>

                {/* 등록 폼 카드 */}
                <div className='bg-white border border-gray-100 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden'>
                    <div className='p-10 md:p-12'>
                        <form onSubmit={handleAdd} className="space-y-8">

                            {/* 제목 필드 */}
                            <div className="group">
                                <label className="block text-[13px] font-bold text-gray-700 mb-3 ml-1 transition-colors group-focus-within:text-blue-600">
                                    공지 제목 *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={board.title}
                                    onChange={handleChange}
                                    placeholder="제목을 입력하세요"
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all duration-200 font-medium"
                                />
                            </div>

                            {/* 중요도 선택 필드 */}
                            <div className="group">
                                <label className="block text-[13px] font-bold text-gray-700 mb-3 ml-1">
                                    중요도 설정 *
                                </label>
                                <select
                                    name="importance"
                                    value={board.importance}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all duration-200 font-bold text-gray-700 appearance-none cursor-pointer"
                                >
                                    <option value="">중요도를 선택해 주세요</option>
                                    <option value="HIGH">🚨 높음 (긴급 공지)</option>
                                    <option value="NORMAL">📅 중간 (일반 소식)</option>
                                    <option value="LOW">💬 낮음 (참고 사항)</option>
                                </select>
                            </div>

                            {/* 내용 필드 */}
                            <div className="group">
                                <label className="block text-[13px] font-bold text-gray-700 mb-3 ml-1 transition-colors group-focus-within:text-blue-600">
                                    상세 내용 *
                                </label>
                                <textarea
                                    name="content"
                                    value={board.content}
                                    onChange={handleChange}
                                    required
                                    rows={10}
                                    placeholder="공지할 내용을 상세히 적어주세요..."
                                    className="w-full px-6 py-5 bg-gray-50 border border-gray-200 rounded-[24px] focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all duration-200 font-medium leading-relaxed resize-none"
                                />
                            </div>

                            {/* 안내 박스 */}
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center">
                                <span className="text-blue-600 mr-3">📢</span>
                                <p className="text-sm text-blue-700 font-medium">
                                    공지사항 등록 시 모든 사원의 대시보드에 즉시 노출됩니다.
                                </p>
                            </div>

                            {/* 등록 버튼 */}
                            <button
                                type="submit"
                                className="w-full bg-black hover:bg-gray-800 text-white rounded-2xl h-16 flex items-center justify-center transition-all active:scale-[0.98] shadow-xl shadow-black/10 group mt-10"
                            >
                                <span className="text-lg font-black mr-2">공지사항 등록 완료</span>
                                <HiSpeakerphone className="text-xl group-hover:rotate-10 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* 푸터 */}
                <div className="text-center mt-12 mb-20 text-gray-300 font-bold text-xs uppercase tracking-[0.3em]">
                    Internal Communication Management
                </div>
            </div>
        </div>
    );
};

export default BoardAdd;