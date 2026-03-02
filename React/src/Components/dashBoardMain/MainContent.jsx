import React from 'react';
import Notices from './ImportanceBoard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Appendance from '../AttendancePanel';

const MainContent = () => {
    return (
        <div className="space-y-6">
            {/* 상단 섹션: 출퇴근 체크(1) & 주간 근무시간(2) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* [1] 출퇴근 체크 위젯 */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-[420px] flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-900">출퇴근 체크</h3>
                        <div className="mt-8 space-y-1">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">현재 시각</p>
                            <p className="text-4xl font-black text-slate-900 tabular-nums">19:33:53</p>
                            <p className="text-slate-500 text-sm font-bold">2026년 2월 25일 수요일</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="h-20 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-500 text-sm font-black">
                            오늘도 화이팅하세요! 👋
                        </div>
                        <div className="h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 cursor-pointer hover:bg-blue-700 transition-colors">
                            출근하기
                        </div>
                    </div>
                </div>

                {/* [2] 주간 근무시간 위젯 */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-[420px] flex flex-col">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">주간 근무시간</h3>
                        <div className="w-24 h-6 bg-slate-50 rounded-full border border-slate-100"></div>
                    </div>
                    <div className="flex-1 mt-10 border-b border-dashed border-slate-200 flex items-end justify-between px-10 pb-4">
                        {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                            <span key={day} className="text-xs font-black text-slate-400 uppercase">{day}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* [3] 최근 출퇴근 기록 섹션 (가로 전체) */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                </div>
                {/* 수정된 테이블 컴포넌트 삽입 */}
                <div className="w-full">
                    <Appendance />
                </div>
            </div>

            {/* [4] 중요 공지사항 */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm shadow-slate-200/50 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-lg font-black text-slate-800">중요 공지사항</h3>
                    <Link
                        to="/dashboard1/board/list"
                        className="group flex items-center gap-1.5 px-4 py-2 text-xs font-black text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                        <span>전체보기</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
                <div className="p-6">
                    <Notices />
                </div>
            </div>
        </div>
    );
};

export default MainContent;