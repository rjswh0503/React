import React, { useState, useEffect } from "react" // 1. useState, useEffect 추가
import { CalendarCheck, Clock, TrendingUp, Coffee } from "lucide-react"
import { useAuth } from "../context/Auth";

const StatsCards = ({ records = [] }) => {
  const { user } = useAuth();
  
  // 2. 실시간 리렌더링을 위한 상태 (현재 시간)
  const [currentTime, setCurrentTime] = useState(new Date());

  // 3. 1분마다 현재 시간을 업데이트하는 타이머 설정
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60초마다 업데이트 (1분 단위 UI이므로 충분)

    return () => clearInterval(timer); // 언마운트 시 정리
  }, []);

  // 실시간 근무 시간 계산 함수 (currentTime 매개변수 추가)
  const calculateRealTimeHours = (record, now) => {
    if (record.workHours > 0) return record.workHours;

    // 오늘 날짜인지 확인
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (record.workDate === todayStr && record.checkInTime && !record.checkOutTime) {
      try {
        const [h, m, s] = record.checkInTime.split(':').map(Number);
        const checkInDate = new Date(now); // 현재 날짜 기준
        checkInDate.setHours(h, m, s || 0, 0);

        const diffMs = now - checkInDate;
        if (diffMs > 0) {
          return diffMs / (1000 * 60 * 60); // 시간 단위 변환
        }
      } catch (e) {
        console.error("시간 계산 오류:", e);
      }
    }
    return record.workHours || 0;
  };

  // --- 이하 계산 로직에 currentTime 적용 ---

  const now = currentTime;
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // 1. 이번 주 근무시간 계산
  const day = now.getDay();
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diffToMon);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekHours = records
    .filter(r => {
      const d = new Date(r.workDate);
      return d >= startOfWeek && d <= now;
    })
    .reduce((acc, r) => acc + calculateRealTimeHours(r, now), 0);

  const weekHoursFormatted = `${Math.floor(weekHours)}h ${Math.round((weekHours % 1) * 60)}m`;

  // 2. 이번 달 출근일
  const monthRecords = records.filter(r => {
    const d = new Date(r.workDate);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });
  const workDays = monthRecords.length;

  // 3. 이번 달 초과근무
  const overtimeHours = monthRecords.reduce((acc, r) => {
    const hours = calculateRealTimeHours(r, now);
    const d = new Date(r.workDate);
    const dayOfWeek = d.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return acc + hours;
    }
    return acc + (hours > 8 ? hours - 8 : 0);
  }, 0);
  const overtimeFormatted = `${Math.floor(overtimeHours)}h ${Math.round((overtimeHours % 1) * 60)}m`;

  // UI 데이터 구조 (동일)
  const stats = [
    {
      label: "한 주의 근무 시간",
      value: weekHoursFormatted,
      target: "40h",
      status: weekHours >= 40 ? "목표 달성" : "진행 중",
      color: "text-slate-900",
      icon: Clock,
    },
    {
      label: "이번 달 출근일",
      value: `${workDays}일`,
      target: "20일",
      status: "정상",
      color: "text-blue-600",
      icon: CalendarCheck,
    },
    {
      label: "이번 달 초과근무",
      value: overtimeFormatted,
      target: "한도 52h",
      status: overtimeHours > 0 ? "발생" : "없음",
      color: "text-slate-900",
      icon: TrendingUp,
    },
    {
      label: "잔여 연차",
      value: user?.totalLeave !== undefined ? `${user.totalLeave - (user.usedLeave || 0)}일` : "연동 중",
      target: `총 ${user?.totalLeave || 15}일`,
      status: "데이터 연동",
      color: "text-slate-900",
      icon: Coffee,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
        >
          {/* UI 코드는 기존과 동일 */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
            <div className="rounded-xl bg-slate-50 p-2 text-slate-400 transition-colors group-hover:bg-slate-100 group-hover:text-slate-600">
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className={`text-2xl font-black tracking-tight ${stat.color}`}>{stat.value ?? "0"}</h3>
            <span className="text-xs font-semibold text-slate-400">/ {stat.target ?? "0"}</span>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">상태</span>
              <span className="text-[11px] font-black text-slate-700">{stat.status ?? "기록 없음"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards;