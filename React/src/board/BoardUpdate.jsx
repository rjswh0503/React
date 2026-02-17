import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { HiOutlineDocumentText, HiOutlineTag, HiOutlineClipboardList, HiOutlinePencilAlt } from 'react-icons/hi';

const BoardUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState({ title: '', content: '', importance: 'NORMAL' });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/api/board/${id}`);
        setBoardData(response.data);
      } catch (e) { console.error(e); }
    };
    if (id) fetchDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/board/${id}`, boardData);
      alert("수정되었습니다.");
      navigate(-1);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl">
        {/* 헤더 섹션: 사원 등록 페이지와 동일한 스타일 */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3 flex items-center">
            <HiOutlinePencilAlt className="mr-4 text-blue-600" /> 게시글 수정
          </h1>
          <p className="text-gray-500 font-medium">공지사항이나 게시글의 내용을 수정합니다. 변경 사항은 즉시 반영됩니다.</p>
        </div>

        {/* 수정 폼 카드 */}
        <div className="bg-white border border-gray-100 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-10 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* 제목 입력 영역 */}
              <div className="group">
                <label className="flex items-center text-[13px] font-bold text-gray-700 mb-3 ml-1">
                  <HiOutlineDocumentText className="mr-2 text-lg text-gray-400" /> 제목 *
                </label>
                <input
                  type="text"
                  name="title"
                  value={boardData.title || ''}
                  onChange={handleChange}
                  placeholder="제목을 입력하세요"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-gray-800 font-medium"
                />
              </div>

              {/* 중요도 선택 영역 */}
              <div className="group">
                <label className="flex items-center text-[13px] font-bold text-gray-700 mb-3 ml-1">
                  <HiOutlineTag className="mr-2 text-lg text-gray-400" /> 중요도 설정 *
                </label>
                <select
                  name="importance"
                  value={boardData.importance}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-gray-800 font-bold appearance-none cursor-pointer"
                >
                  <option value="NORMAL">일반 공지 (Normal)</option>
                  <option value="HIGH">긴급 공지 (High Priority)</option>
                </select>
              </div>

              {/* 내용 입력 영역 */}
              <div className="group">
                <label className="flex items-center text-[13px] font-bold text-gray-700 mb-3 ml-1">
                  <HiOutlineClipboardList className="mr-2 text-lg text-gray-400" /> 상세 내용 *
                </label>
                <textarea
                  name="content"
                  value={boardData.content || ''}
                  onChange={handleChange}
                  rows="10"
                  placeholder="수정할 내용을 입력해 주세요..."
                  className="w-full px-6 py-5 bg-gray-50 border border-gray-200 rounded-[24px] focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-gray-800 font-medium resize-none leading-relaxed"
                />
              </div>

              {/* 버튼 섹션 */}
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl h-16 flex items-center justify-center transition-all font-bold active:scale-[0.98]"
                >
                  취소 및 돌아가기
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-black hover:bg-gray-800 text-white rounded-2xl h-16 flex items-center justify-center transition-all active:scale-[0.98] shadow-xl shadow-black/10 group"
                >
                  <span className="text-lg font-black mr-2">게시글 수정 완료</span>
                  <HiOutlinePencilAlt className="text-xl group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 하단 푸터 */}
        <div className="text-center mt-12 mb-20 text-gray-300 font-bold text-xs uppercase tracking-[0.3em]">
          Notice Management System
        </div>
      </div>
    </div>
  );
};

export default BoardUpdate;