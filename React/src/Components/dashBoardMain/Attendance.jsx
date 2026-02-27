import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Filter } from 'lucide-react';
import api from '../../api/api';

// 상태별 스타일 정의 (배경색/글자색/테두리)
const statusStyles = {
    NORMAL: "bg-emerald-50 text-emerald-600 border-emerald-100",
    LATE: "bg-amber-50 text-amber-600 border-amber-100",
    ABSENT: "bg-rose-50 text-rose-600 border-rose-100",
    VACATION: "bg-blue-50 text-blue-600 border-blue-100",
    OVERTIME: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

export default function AttendancePage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAttendance() {
            try {
                const response = await api.get('/api/attendance/me');
                setRecords(response.data || []);
            } catch (err) {
                console.error("Failed to load attendance", err);
            } finally {
                setLoading(false);
            }
        }
        loadAttendance();
    }, []);

    return (
        <div className="space-y-6">
            {/* 상단 헤더 영역 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">출퇴근 기록</h2>
                    <p className="text-slate-500 mt-1 font-medium italic text-sm">본인의 전체 근태 이력을 확인할 수 있습니다.</p>
                </div>
                
                {/* 필터 버튼 (디자인용 가이드) */}
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                    <Filter className="w-3.5 h-3.5" />
                    필터링
                </button>
            </div>

            {/* 메인 리스트 카드 */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm shadow-slate-200/50 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <h3 className="text-lg font-black text-slate-800">전체 출퇴근 내역</h3>
                </div>

                <div className="p-4 md:p-8">
                    {loading ? (
                        <div className="py-20 text-center text-slate-400 font-bold animate-pulse">
                            기록을 불러오는 중입니다...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400">날짜</th>
                                        <th className="pb-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400">출근 시간</th>
                                        <th className="pb-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400">퇴근 시간</th>
                                        <th className="pb-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400">근무 시간</th>
                                        <th className="pb-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400">상태</th>
                                        <th className="pb-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400">비고</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {records.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-16 text-center text-slate-300 font-bold italic text-sm">
                                                출퇴근 기록이 존재하지 않습니다.
                                            </td>
                                        </tr>
                                    ) : (
                                        records.map((record) => (
                                            <tr key={record.id} className="group hover:bg-slate-50/50 transition-all">
                                                <td className="p-4 text-sm font-bold text-slate-700 tabular-nums">
                                                    {record.workDate}
                                                </td>
                                                <td className="p-4 font-mono text-sm font-medium text-slate-600">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                                                        {record.checkInTime || "---"}
                                                    </div>
                                                </td>
                                                <td className="p-4 font-mono text-sm font-medium text-slate-600">
                                                    {record.checkOutTime || "---"}
                                                </td>
                                                <td className="p-4 font-mono text-xs font-black text-slate-400">
                                                    {record.workHours 
                                                        ? `${Math.floor(record.workHours)}h ${Math.round((record.workHours % 1) * 60)}m` 
                                                        : "---"}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black border transition-colors ${
                                                        statusStyles[record.statusCode] || "bg-slate-50 text-slate-500 border-slate-100"
                                                    }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-xs font-medium text-slate-400 italic">
                                                    {record.notes || "-"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}