import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Tag } from 'lucide-react';
import api from '../../api/api';
import AttendanceFilter from './AttendanceFilter'; // 위에서 만든 컴포넌트

const statusStyles = {
    NORMAL: "bg-emerald-50 text-emerald-600 border-emerald-100",
    LATE: "bg-rose-50 text-rose-600 border-rose-100",
    ABSENT: "bg-slate-50 text-slate-400 border-slate-100",
    // 추가 상태들
    VACATION: "bg-blue-50 text-blue-600 border-blue-100",
};

const EmployeeAttendance = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);

    // 날짜 상태 (기본값: 이번 달 1일 ~ 오늘)
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    // [API 호출] 특정 기간 조회 (/me/period 사용)
    const fetchAttendanceData = useCallback(async () => {
        setLoading(true);
        try {
            // 컨트롤러의 @GetMapping("/me/period") 구조에 맞춤
            // 주의: 관리자용 API라면 주소를 `/api/admin/attendance/employee/${id}/period` 등으로 맞춰야 할 수 있습니다.
            const response = await api.get(`/api/attendance/me/period`, {
                params: { startDate, endDate }
            });
            setAttendanceList(response.data || []);
        } catch (error) {
            console.error('근태 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchAttendanceData();
    }, [id]); // 초기 로드

    const handleReset = () => {
        const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        setStartDate(firstDay);
        setEndDate(today);
        // 리셋 후 다시 조회하고 싶다면 fetch 호출 추가
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full border border-transparent hover:border-slate-200 transition-all">
                        <ArrowLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">근태 기록 조회</h2>
                        <p className="text-slate-500 text-sm font-medium">사원번호: {id}</p>
                    </div>
                </div>

                {/* 필터 컴포넌트 삽입 */}
                <AttendanceFilter 
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    onSearch={fetchAttendanceData}
                    onReset={handleReset}
                />
            </div>

            {/* 테이블 섹션 (기존 코드와 동일) */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                {/* ... (기존 테이블 렌더링 로직) ... */}
                <div className="p-8">
                    {loading ? (
                         <div className="py-20 text-center animate-pulse font-black text-slate-300">데이터를 불러오는 중...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-4 px-4 text-[11px] font-black uppercase text-slate-400">날짜</th>
                                        <th className="pb-4 px-4 text-[11px] font-black uppercase text-slate-400">출퇴근 시간</th>
                                        <th className="pb-4 px-4 text-[11px] font-black uppercase text-slate-400 text-center">상태</th>
                                        <th className="pb-4 px-4 text-[11px] font-black uppercase text-slate-400">비고</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceList.map(record => (
                                        <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                                            <td className="p-4 text-sm font-black text-slate-700">{record.workDate}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <Clock className="w-3 h-3 text-blue-400" />
                                                    {record.checkInTime?.substring(0,5)} ~ {record.checkOutTime?.substring(0,5) || "--:--"}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black border ${statusStyles[record.statusCode]}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs text-slate-400 italic">{record.notes || "-"}</td>
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
};

export default EmployeeAttendance;