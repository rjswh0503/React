"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, Clock, Filter, AlertCircle, Search, RotateCcw, CheckCircle2 } from 'lucide-react';
import api from '../../api/api';

// 근태 상태별 스타일 정의
const statusStyles = {
    NORMAL: "bg-emerald-50 text-emerald-600 border-emerald-100",
    LATE: "bg-amber-50 text-amber-600 border-amber-100",
    ABSENT: "bg-rose-50 text-rose-600 border-rose-100",
    VACATION: "bg-blue-50 text-blue-600 border-blue-100",
    OVERTIME: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

// 상태 선택 옵션 (상태별 조회용)
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
    const [error, setError] = useState(null);

    // --- 필터 상태 관리 ---
    const [filterType, setFilterType] = useState('period'); // 'period', 'month', 'status'
    
    // 기간별 상태
    const initialFirstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const initialToday = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(initialFirstDay);
    const [endDate, setEndDate] = useState(initialToday);
    
    // 월별 상태
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    
    // 상태별 상태
    const [selectedStatus, setSelectedStatus] = useState('ALL');

    // --- 데이터 로딩 로직 ---
    const loadAttendance = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            
            // 선택된 필터 타입에 따라 다른 API 엔드포인트 호출
            if (filterType === 'period') {
                response = await api.get('/api/attendance/me/period', { params: { startDate, endDate } });
            } else if (filterType === 'month') {
                response = await api.get('/api/attendance/me/month', { params: { year: selectedYear, month: selectedMonth } });
            } else if (filterType === 'status') {
                if (selectedStatus === 'ALL') {
                    response = await api.get('/api/attendance/me');
                } else {
                    response = await api.get(`/api/attendance/me/status/${selectedStatus}`);
                }
            }
            
            setRecords(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("데이터 로드 실패:", err);
            setError("근태 기록을 불러오는 데 실패했습니다. 다시 시도해 주세요.");
        } finally {
            setLoading(false);
        }
    }, [filterType, startDate, endDate, selectedYear, selectedMonth, selectedStatus]);

    // 초기 로드 및 필터 변경 시 자동 조회
    useEffect(() => {
        loadAttendance();
    }, [loadAttendance]);

    const handleReset = () => {
        setStartDate(initialFirstDay);
        setEndDate(initialToday);
        setSelectedYear(new Date().getFullYear());
        setSelectedMonth(new Date().getMonth() + 1);
        setSelectedStatus('ALL');
        setFilterType('period');
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-2">
            {/* 1. 상단 헤더 및 필터 섹션 */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">출퇴근 기록 내역</h2>
                    <p className="text-slate-500 mt-1 font-medium text-sm italic">원하는 조건을 선택하여 근태 이력을 조회하세요.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-[1.5rem] border border-slate-200 shadow-sm shadow-slate-100">
                    {/* 조회 방식 선택 */}
                    <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-slate-50 border-none text-xs font-black text-slate-600 px-4 py-2.5 rounded-xl outline-none cursor-pointer hover:bg-slate-100 transition-all shadow-inner"
                    >
                        <option value="period">기간별</option>
                        <option value="month">월별</option>
                        <option value="status">상태별</option>
                    </select>

                    <div className="h-6 w-[1px] bg-slate-200 mx-1" />

                    {/* 타입별 입력 필드 */}
                    <div className="flex items-center">
                        {filterType === 'period' && (
                            <div className="flex items-center gap-2">
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-xs font-bold text-slate-600 outline-none bg-transparent" />
                                <span className="text-slate-300 font-black">~</span>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-xs font-bold text-slate-600 outline-none bg-transparent" />
                            </div>
                        )}

                        {filterType === 'month' && (
                            <div className="flex items-center gap-2">
                                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="text-xs font-bold text-slate-600 outline-none bg-transparent">
                                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}년</option>)}
                                </select>
                                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="text-xs font-bold text-slate-600 outline-none bg-transparent">
                                    {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}월</option>)}
                                </select>
                            </div>
                        )}

                        {filterType === 'status' && (
                            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="text-xs font-bold text-slate-600 outline-none bg-transparent px-2">
                                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 ml-2">
                        <button 
                            onClick={loadAttendance}
                            className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
                            title="검색"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={handleReset}
                            className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 hover:text-slate-600 transition-all"
                            title="초기화"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. 메인 리스트 카드 */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-black text-slate-800">조회 결과 리스트</h3>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm uppercase tracking-tighter">
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
                                    {records.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-2 text-slate-200">
                                                    <Calendar className="w-12 h-12 opacity-30" />
                                                    <p className="font-bold italic text-sm">해당 조건에 맞는 근태 기록이 없습니다.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        records.map((record) => (
                                            <tr key={record.id} className="group hover:bg-slate-50/80 transition-all cursor-default">
                                                <td className="p-6 text-sm font-black text-slate-700 tabular-nums text-center">
                                                    {record.workDate}
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2 font-mono text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                                                        <Clock className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400" />
                                                        {record.checkInTime ? record.checkInTime.substring(0, 5) : "--:--"}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2 font-mono text-sm font-medium text-slate-600 group-hover:text-rose-600 transition-colors">
                                                        <Clock className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-400" />
                                                        {record.checkOutTime ? record.checkOutTime.substring(0, 5) : "--:--"}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black border shadow-sm transition-all ${
                                                        statusStyles[record.statusCode] || "bg-slate-50 text-slate-400 border-slate-100"
                                                    }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-xs font-medium text-slate-400 italic max-w-[200px] truncate" title={record.notes}>
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