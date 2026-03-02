import React, { useState, useEffect } from "react"
import { Users, Clock, AlertCircle, CheckCircle2, ChevronRight, Loader2 } from "lucide-react"
import api from '../../api/api';

export default function AdminDashboard() {
    const [requests, setRequests] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [todayCount, setTodayCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const [empRes, attRes] = await Promise.all([
                    api.get('/api/admin/employees'),
                    api.get('/api/admin/attendance/today-list')
                ]);

                setEmployees(empRes.data || []);
                const todayRecords = attRes.data || [];
                const checkedIn = todayRecords.filter(record => record.checkInTime !== null).length;
                setTodayCount(checkedIn);
                setIsLoading(false);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const attendanceRate = employees.length > 0 ? Math.round((todayCount / employees.length) * 100) : 0;

    return (
        <div className="flex flex-col gap-6 p-6 bg-white animate-in fade-in duration-500">
            {/* 상단 헤더 */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">관리자 대시보드</h1>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider opacity-60">System Overview</p>
            </div>

            {/* 통계 그리드 섹션 */}
            <div className="grid gap-4 md:grid-cols-3">
                
                {/* [카드 1] 전체 사원 */}
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300">
                    <div className="flex items-center justify-between pb-3">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">전체 사원</span>
                        <div className="rounded-xl bg-slate-50 p-2 text-slate-400">
                            <Users className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                        {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-200" /> : `${employees.length}명`}
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold mt-1">WorkHub 등록 계정</p>
                </div>

                {/* [카드 2] 오늘 출근 - 특수 Border 제거 버전 */}
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300">
                    <div className="flex items-center justify-between pb-3">
                        <span className="text-[11px] font-black text-blue-500 uppercase tracking-widest">오늘 출근</span>
                        <div className="rounded-xl bg-blue-50 p-2 text-blue-400">
                            <Clock className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                        {isLoading ? <div className="h-9 w-16 animate-pulse rounded bg-slate-100" /> : `${todayCount}명`}
                    </div>
                    <p className="text-[11px] font-black text-blue-600 mt-1">
                        현재 출근율 {attendanceRate}%
                    </p>
                </div>

                {/* [카드 3] 처리 대기 */}
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300">
                    <div className="flex items-center justify-between pb-3">
                        <span className="text-[11px] font-black text-orange-400 uppercase tracking-widest">처리 대기</span>
                        <div className="rounded-xl bg-orange-50 p-2 text-orange-400">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-orange-700">{requests.length}건</div>
                    <p className="text-[11px] text-orange-600 font-bold mt-1">미승인 요청 건수</p>
                </div>
            </div>

            {/* 하단 리스트: 결재 대기 목록 */}
            <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/30">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-slate-900">결재 대기 목록</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="bg-white border-b border-slate-100 text-slate-400">
                                <th className="px-8 py-4 font-black uppercase tracking-widest text-[10px]">요청자</th>
                                <th className="px-8 py-4 font-black uppercase tracking-widest text-[10px]">유형</th>
                                <th className="px-8 py-4 font-black uppercase tracking-widest text-[10px]">일자</th>
                                <th className="px-8 py-4 text-right font-black uppercase tracking-widest text-[10px]">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-4 font-bold text-slate-900">{req.name}</td>
                                    <td className="px-8 py-4">
                                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">
                                            {req.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-slate-500 font-medium">{req.date}</td>
                                    <td className="px-8 py-4 text-right">
                                        <button className="inline-flex items-center px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95">
                                            상세보기
                                            <ChevronRight className="ml-1 h-3 w-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!isLoading && requests.length === 0 && (
                    <div className="p-20 text-center">
                        <CheckCircle2 className="h-8 w-8 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold tracking-tight">대기 중인 요청이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}