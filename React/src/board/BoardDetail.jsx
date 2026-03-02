import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserIcon, CalendarIcon, ChevronLeft } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/Auth';
import DeleteButton from '../Components/DeleteButton';

const BoardDetail = () => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/board/${id}`);
                setDetail(response.data);
            } catch (error) {
                // 기존 코드의 참조 오류(e -> error) 수정
                console.error("게시글 상세 조회 실패:", error);
                if (error.response) {
                    console.log('에러 상세:', error.response.data);
                    console.log('상태 코드:', error.response.status);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // 로딩 상태 UI
    if (loading) {
        return (
            <div className="mx-auto flex max-w-4xl items-center justify-center py-20">
                <div className="text-sm text-gray-500">데이터를 불러오는 중입니다...</div>
            </div>
        );
    }

    // 예외 처리 (데이터가 없을 경우)
    if (!detail) {
        return (
            <div className="mx-auto flex max-w-4xl items-center justify-center py-20">
                <div className="text-sm text-gray-500">게시글을 찾을 수 없습니다.</div>
            </div>
        );
    }

    // 날짜 포맷팅 통일
    const date = new Date(detail.createdAt);
    const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

    return (
        <div className='mx-auto w-full max-w-4xl px-4 py-8'>
            {/* 상단 네비게이션 */}
            <div className='mb-6'>
                <Link
                    to="/dashboard1/board/list"
                    className='inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-900'
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    공지사항 목록
                </Link>
            </div>

            <article className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
                {/* 헤더 영역 */}
                <div className='border-b border-gray-100 p-6 sm:p-8'>
                    <div className='mb-4 flex items-center gap-2'>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${detail.importance === 'HIGH'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                            {detail.importance === 'HIGH' ? '긴급' : '일반'}
                        </span>
                    </div>

                    <h1 className='text-2xl font-bold leading-snug tracking-tight text-gray-900 sm:text-3xl text-balance'>
                        {detail.title}
                    </h1>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
                        {/* 작성자 및 날짜 정보 */}
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <UserIcon className="h-4 w-4" />
                                {detail.position || '작성자'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CalendarIcon className="h-4 w-4" />
                                {dateStr}
                            </span>
                        </div>

                        {/* 관리자 권한 액션 버튼 */}
                        {user && user.role === 'ADMIN' && (
                            <div className="flex items-center gap-2">
                                <Link
                                    to={`/dashboard/board/edit/${detail.noticeId}`}
                                    className="rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    수정
                                </Link>
                                {detail.noticeId && (
                                    <DeleteButton
                                        boardId={detail.noticeId}
                                        onDeleteSuccess={() => navigate('/board/list')}
                                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                                    >
                                        삭제
                                    </DeleteButton>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 본문 영역 */}
                <div className='p-6 sm:p-8'>
                    <div className='whitespace-pre-wrap text-[15px] leading-relaxed text-gray-800'>
                        {detail.content}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BoardDetail;