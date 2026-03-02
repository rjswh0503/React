"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import api from '../../api/api';
import AttendanceFilter from '../employee/AttendanceFilter'; // 위에서 만든 컴포넌트 임포트

const statusStyles = {
    NORMAL: "bg-emerald-50 text-emerald-600 border-emerald-100",
    LATE: "bg-amber-50 text-amber-600 border-amber-100",
    ABSENT: "bg-rose-50 text-rose-600 border-rose-100",
    VACATION: "bg-blue-50 text-blue-600 border-blue-100",
    OVERTIME: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

const statusOptions = [
    { label: "전체 상태", value: "ALL" },
    { label: "정상출근", value: "NORMAL" },
    { label: "지각", value: "LATE" },
    { label: "결근", value: "ABSENT" },
    { label: "휴가", value: "VACATION" },
];

export default function AttendancePage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('period');
    
    // 초기 날짜 설정
    const initialFirstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const initialToday = new Date().toISOString().split('T')[0];
    
    const [startDate, setStartDate] = useState(initialFirstDay);
    const [endDate, setEndDate] = useState(initialToday);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedStatus, setSelectedStatus] = useState('ALL');

    const loadAttendance = useCallback(async () => {
        setLoading(true);
        try {
            let response;
            if (filterType === 'period') {
                response = await api.get('/api/attendance/me/period', { params: { startDate, endDate } });
            } else if (filterType === 'month') {
                response = await api.get('/api/attendance/me/month', { params: { year: selectedYear, month: selectedMonth } });
            } else if (filterType === 'status') {
                response = selectedStatus === 'ALL' 
                    ? await api.get('/api/attendance/me') 
                    : await api.get(`/api/attendance/me/status/${selectedStatus}`);
            }
            setRecords(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("데이터 로드 실패:", err);
        } finally {
            setLoading(false);
        }
    }, [filterType, startDate, endDate, selectedYear, selectedMonth, selectedStatus]);

    useEffect(() => { loadAttendance(); }, [loadAttendance]);

    const handleReset = () => {
        setStartDate(initialFirstDay);
        setEndDate(initialToday);
        setSelectedYear(new Date().getFullYear());
        setSelectedMonth(new Date().getMonth() + 1);
        setSelectedStatus('ALL');
        setFilterType('period');
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-2 text-left">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">출퇴근 기록 내역</h2>
                    <p className="text-slate-500 mt-1 font-medium text-sm italic">원하는 조건을 선택하여 근태 이력을 조회하세요.</p>
                </div>

                {/* 분리된 필터 컴포넌트 호출 */}
                <AttendanceFilter 
                    filterType={filterType} setFilterType={setFilterType}
                    startDate={startDate} setStartDate={setStartDate}
                    endDate={endDate} setEndDate={setEndDate}
                    selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                    selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                    selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
                    statusOptions={statusOptions}
                    onSearch={loadAttendance} onReset={handleReset}
                />
            </div>

            {/* 리스트 섹션 */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-black text-slate-800">조회 결과 리스트</h3>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm uppercase">
                        Total {records.length} Records
                    </div>
                </div>

                <div className="p-4 md:p-8">
                    {loading ? (
                        <div className="py-24 flex flex-col items-center gap-4 animate-pulse">
                            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
                            <p className="text-slate-400 font-black text-sm">데이터를 분석 중입니다...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-4 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">날짜</th>
                                        <th className="pb-4 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">출근 시간</th>
                                        <th className="pb-4 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">퇴근 시간</th>
                                        <th className="pb-4 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">상태</th>
                                        <th className="pb-4 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">비고 (메모)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {records.map((record) => (
                                        <tr key={record.id} className="group hover:bg-slate-50/80 transition-all">
                                            <td className="p-6 text-sm font-black text-slate-700 tabular-nums text-center">{record.workDate}</td>
                                            <td className="p-6 font-mono text-sm font-medium text-slate-600">{record.checkInTime?.substring(0, 5) || "--:--"}</td>
                                            <td className="p-6 font-mono text-sm font-medium text-slate-600">{record.checkOutTime?.substring(0, 5) || "--:--"}</td>
                                            <td className="p-6 text-center">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black border ${statusStyles[record.statusCode] || ""}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-xs text-slate-400 italic truncate max-w-[200px]">{record.notes || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}