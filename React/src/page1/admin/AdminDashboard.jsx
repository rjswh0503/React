"use client"

import React from "react"
import { Users, Clock, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react"

export default function AdminDashboard() {
    // UI 확인용 정적 샘플 데이터
    const sampleRequests = [
        { id: 1, name: "김철수", type: "연차 신청", date: "2026-02-24" },
        { id: 2, name: "이영희", type: "근태 정정", date: "2026-02-24" },
        { id: 3, name: "박지성", type: "재택 근무", date: "2026-02-25" },
    ];

    return (
        <div className="flex flex-col gap-6 p-6 bg-white">
            {/* 헤더 섹션 */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">관리자 대시보드</h1>
                <p className="text-sm text-slate-500 font-medium">WorkHub의 전반적인 현황을 관리합니다.</p>
            </div>

            {/* 통계 그리드 섹션 */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* 전체 사원 카드 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">전체 사원</span>
                        <Users className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">128 명</div>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">현재 재직 중인 사원 수</p>
                    </div>
                </div>

                {/* 오늘 출근 카드 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">오늘 출근</span>
                        <Clock className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">115 명</div>
                        <p className="text-[11px] text-slate-400 font-medium mt-1 text-blue-600">출근 비율: 90%</p>
                    </div>
                </div>

                {/* 처리 대기 카드 (강조형) */}
                <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-bold text-orange-700 uppercase tracking-tight">처리 대기</span>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-orange-700">12 건</div>
                        <p className="text-[11px] text-orange-600 font-medium mt-1">승인이 필요한 새로운 요청</p>
                    </div>
                </div>
            </div>

            {/* 결재 대기 목록 섹션 */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">결재 대기 목록</h2>
                        <p className="text-xs text-slate-500 font-medium">사원들이 신청한 휴가 및 근태 정정 요청을 관리합니다.</p>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500">
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">요청자</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">유형</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">일자</th>
                                <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-[10px]">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sampleRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-900">{req.name}</td>
                                    <td className="px-6 py-4 font-bold text-blue-600/80">{req.type}</td>
                                    <td className="px-6 py-4 text-slate-500 font-medium">{req.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all shadow-sm active:scale-95 group-hover:border-slate-400">
                                            상세보기
                                            <ChevronRight className="ml-1 h-3 w-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {sampleRequests.length === 0 && (
                    <div className="p-12 text-center text-slate-400 font-medium">
                        대기 중인 요청이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}