import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import api from '../api/api'; // 본인의 api 경로 확인

// 상태별 스타일 정의 (배경색/글자색)
const statusStyles = {
  NORMAL: "bg-emerald-50 text-emerald-600 border-emerald-100",
  LATE: "bg-amber-50 text-amber-600 border-amber-100",
  ABSENT: "bg-rose-50 text-rose-600 border-rose-100",
  VACATION: "bg-blue-50 text-blue-600 border-blue-100",
  OVERTIME: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

export default function Attendance() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttendance() {
      try {
        const response = await api.get('/api/attendance/me');
        // 최신 5개만 표시
        setRecords((response.data || []).slice(0, 5));
      } catch (err) {
        console.error("Failed to load attendance", err);
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <div className="text-sm font-bold text-slate-400 animate-pulse italic">기록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 헤더 부분 */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          최근 출퇴근 기록
        </h3>
        <button
          type="button"
          onClick={() => navigate('/dashboard1/attendance/me')}
          className="group flex items-center gap-1 text-[11px] font-black text-slate-400 transition-all hover:text-blue-600"
        >
          전체보기
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* 테이블 본체 */}
      <div className="overflow-x-auto px-1">
        <table className="w-full text-left" role="table">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-4 text-[11px] font-black uppercase tracking-widest text-slate-400">날짜</th>
              <th className="pb-4 text-[11px] font-black uppercase tracking-widest text-slate-400">출근</th>
              <th className="pb-4 text-[11px] font-black uppercase tracking-widest text-slate-400">퇴근</th>
              <th className="pb-4 text-[11px] font-black uppercase tracking-widest text-slate-400">근무시간</th>
              <th className="pb-4 text-right text-[11px] font-black uppercase tracking-widest text-slate-400">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm font-bold text-slate-300 italic">
                  기록이 없습니다.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.id}
                  className="group transition-all hover:bg-slate-50/50"
                >
                  <td className="py-4 text-sm font-bold text-slate-700 tabular-nums">
                    {record.workDate}
                  </td>
                  <td className="py-4 font-mono text-sm font-medium text-slate-600">
                    {record.checkInTime || "---"}
                  </td>
                  <td className="py-4 font-mono text-sm font-medium text-slate-600">
                    {record.checkOutTime || "---"}
                  </td>
                  <td className="py-4 font-mono text-xs font-bold text-slate-400">
                    {record.workHours 
                      ? `${Math.floor(record.workHours)}h ${Math.round((record.workHours % 1) * 60)}m` 
                      : "---"}
                  </td>
                  <td className="py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black border transition-colors ${
                      statusStyles[record.statusCode] || "bg-slate-50 text-slate-500 border-slate-100"
                    }`}>
                      {record.status}   
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}