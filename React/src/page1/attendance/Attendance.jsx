
import React, { useEffect, useState } from "react"
import api from "../../api/api" // 실제 API 경로에 맞게 수정하세요
import { Clock, Calendar, Search, RotateCcw } from "lucide-react"

// 출근 상태별 스타일 매핑
const statusStyles = {
    NORMAL: "bg-emerald-50 text-emerald-600 border-emerald-100",
    LATE: "bg-red-50 text-red-600 border-red-100",
    ABSENT: "bg-slate-100 text-slate-600 border-slate-200",
    VACATION: "bg-blue-50 text-blue-600 border-blue-100",
    OVERTIME: "bg-purple-50 text-purple-600 border-purple-100",
}

export default function AttendancePage() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadAttendance() {
            try {
                setLoading(true)
                // 실제 호출 경로에 맞게 수정하세요 (예: /api/attendance)
                const response = await api.get("/api/attendance")
                setRecords(response.data)
            } catch (err) {
                console.error("출퇴근 기록 로드 실패", err)
            } finally {
                setLoading(false)
            }
        }
        loadAttendance()
    }, [])

    return (
        <div className="flex flex-col gap-6 p-6 bg-white">
            {/* 헤더 섹션 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">출퇴근 기록</h1>
                    <p className="text-sm text-slate-500 font-medium">나의 일자별 출퇴근 내역을 확인합니다.</p>
                </div>
            </div>

            {/* 통계 요약 카드 (옵션) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">이번 달 지각</p>
                    <p className="text-2xl font-black text-red-500">2 <span className="text-sm">회</span></p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">평균 출근 시간</p>
                    <p className="text-2xl font-black text-slate-800">08:54</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">총 근무 시간</p>
                    <p className="text-2xl font-black text-blue-600">162h 30m</p>
                </div>
            </div>

            {/* 기록 리스트 카드 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-slate-400" />
                        전체 출퇴근 내역
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500">
                                <th className="px-6 py-4 font-bold uppercase text-[11px] tracking-wider">날짜</th>
                                <th className="px-6 py-4 font-bold uppercase text-[11px] tracking-wider">출근 시간</th>
                                <th className="px-6 py-4 font-bold uppercase text-[11px] tracking-wider">퇴근 시간</th>
                                <th className="px-6 py-4 font-bold uppercase text-[11px] tracking-wider">근무 시간</th>
                                <th className="px-6 py-4 font-bold uppercase text-[11px] tracking-wider text-center">상태</th>
                                <th className="px-6 py-4 font-bold uppercase text-[11px] tracking-wider">비고</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium">데이터를 불러오는 중...</td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium">기록된 출퇴근 내역이 없습니다.</td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">{record.workDate}</td>
                                        <td className="px-6 py-4 font-mono font-medium">{record.checkInTime || "---"}</td>
                                        <td className="px-6 py-4 font-mono font-medium">{record.checkOutTime || "---"}</td>
                                        <td className="px-6 py-4 font-mono text-blue-600 font-bold">
                                            {record.workHours ? 
                                                `${Math.floor(record.workHours)}h ${Math.round((record.workHours % 1) * 60)}m` 
                                                : "---"
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${statusStyles[record.statusCode] || "bg-slate-50 text-slate-400 border-slate-100"}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400 font-medium">{record.notes || "-"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}