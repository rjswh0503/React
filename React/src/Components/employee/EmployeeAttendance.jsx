"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Clock, ArrowLeft, User } from 'lucide-react';
import api from '../../api/api';

const statusStyles = {
    NORMAL: "bg-emerald-50 text-emerald-600 border-emerald-100",
    LATE: "bg-amber-50 text-amber-600 border-amber-100",
    ABSENT: "bg-rose-50 text-rose-600 border-rose-100",
    VACATION: "bg-blue-50 text-blue-600 border-blue-100",
    OVERTIME: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

export default function EmployeeAttendance() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // ✅ 리액트 라우터의 state 데이터를 가져옴

    // ✅ 전달받은 state가 있으면 사용하고, 없으면 빈 객체 할당
    const empInfo = location.state || {}; 
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadAttendance = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await api.get(`/api/admin/attendance/employee/${id}`);
            setRecords(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("데이터 로드 실패:", err);
            setRecords([]);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { loadAttendance(); }, [loadAttendance]);

    return (
        <div className="max-w-6xl mx-auto p-8 animate-in fade-in duration-700">
            {/* 상단 헤더: 사원 목록에서 넘겨받은 이름을 즉시 표시 */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6 text-left">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-3 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-200 shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                {/* ✅ 넘겨받은 이름이 있으면 이름 표시, 없으면 기본 메시지 */}
                                {empInfo.name ? `${empInfo.name} 님의 근무 기록` : "사원 근무 기록"}
                            </h2>
                            {/* ✅ 넘겨받은 사번이 있으면 바로 표시 */}
                            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black tracking-widest flex items-center gap-1.5 shadow-sm">
                                <User className="w-3 h-3" /> {empInfo.employeeNo || `ID:${id}`}
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm italic">전체 출퇴근 타임라인입니다.</p>
                    </div>
                </div>
                
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Records</span>
                    <span className="text-2xl font-black text-slate-900">{records.length}건</span>
                </div>
            </div>

            {/* 메인 리스트 카드 */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8">
                    {loading ? (
                        <div className="py-40 flex flex-col items-center gap-4 animate-pulse">
                            <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                            <p className="text-slate-300 font-black text-[10px] tracking-widest uppercase italic">Loading Timeline</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto text-left">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-6 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">날짜</th>
                                        <th className="pb-6 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">출근 시각</th>
                                        <th className="pb-6 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">퇴근 시각</th>
                                        <th className="pb-6 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">근태 상태</th>
                                        <th className="pb-6 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">비고</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-sans">
                                    {records.length === 0 ? (
                                        <tr><td colSpan={5} className="py-32 text-center text-slate-300 font-bold italic">기록된 근무 데이터가 없습니다.</td></tr>
                                    ) : (
                                        records.map((record) => (
                                            <tr key={record.id} className="group hover:bg-slate-50/50 transition-all cursor-default">
                                                <td className="p-6 text-sm font-black text-slate-800 text-center tabular-nums">{record.workDate}</td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3 font-mono text-sm font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-125 transition-transform" />
                                                        {record.checkInTime ? record.checkInTime.substring(0, 5) : "--:--"}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3 font-mono text-sm font-bold text-slate-500 group-hover:text-rose-500 transition-colors">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 group-hover:scale-125 transition-transform" />
                                                        {record.checkOutTime ? record.checkOutTime.substring(0, 5) : "--:--"}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black border tracking-tight shadow-sm ${statusStyles[record.statusCode] || "bg-slate-50 text-slate-400"}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-xs text-slate-400 italic truncate max-w-[180px]">{record.notes || "-"}</td>
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