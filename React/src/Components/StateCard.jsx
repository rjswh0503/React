import React from "react"
import { CalendarCheck, Clock, TrendingUp, Coffee } from "lucide-react"
import { useAuth } from "../context/Auth";

const StatsCards = ({ records = [] }) => {
  const { user } = useAuth();

  // 오늘 날짜 정보
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  // 실시간 근무 시간 계산 함수 (오늘 출근했으나 퇴근 전인 경우)
  const calculateRealTimeHours = (record) => {
    if (record.workHours > 0) return record.workHours;

    // 오늘 날짜인지 확인 (로컬 시간 기준)
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (record.workDate === todayStr && record.checkInTime && !record.checkOutTime) {
      try {
        const [h, m, s] = record.checkInTime.split(':').map(Number);
        const checkInDate = new Date();
        checkInDate.setHours(h, m, s || 0, 0);

        const diffMs = new Date() - checkInDate;
        if (diffMs > 0) {
          return diffMs / (1000 * 60 * 60); // 시간 단위
        }
      } catch (e) {
        console.error("시간 계산 오류:", e);
      }
    }
    return record.workHours || 0;
  };

  // 1. 이번 주 근무시간 계산 (월요일 ~ 일요일 전체 합산)
  const day = now.getDay();
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diffToMon);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekHours = records
    .filter(r => {
      const d = new Date(r.workDate);
      // 이번 주 범위 내에 있는 모든 기록 합산
      return d >= startOfWeek && d <= now;
    })
    .reduce((acc, r) => acc + calculateRealTimeHours(r), 0);

  const weekHoursFormatted = `${Math.floor(weekHours)}h ${Math.round((weekHours % 1) * 60)}m`;

  // 2. 이번 달 출근일 계산
  const monthRecords = records.filter(r => {
    const d = new Date(r.workDate);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });
  const workDays = monthRecords.length;

  // 3. 이번 달 초과근무 (평일 8시간 초과분 + 주말 근무 전체 합산)
  const overtimeHours = monthRecords.reduce((acc, r) => {
    const hours = calculateRealTimeHours(r);
    const d = new Date(r.workDate);
    const dayOfWeek = d.getDay();

    // 주말(토:6, 일:0)인 경우 근무 시간 전체를 초과근무로 처리
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return acc + hours;
    }
    // 평일인 경우 8시간을 초과한 시간만 합산
    return acc + (hours > 8 ? hours - 8 : 0);
  }, 0);
  const overtimeFormatted = `${Math.floor(overtimeHours)}h ${Math.round((overtimeHours % 1) * 60)}m`;

  // UI 데이터 구조
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
          {/* 상단 라벨 및 아이콘 */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {stat.label}
            </p>
            <div className="rounded-xl bg-slate-50 p-2 text-slate-400 transition-colors group-hover:bg-slate-100 group-hover:text-slate-600">
              <stat.icon className="h-5 w-5" />
            </div>
          </div>

          {/* 메인 수치 */}
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className={`text-2xl font-black tracking-tight ${stat.color}`}>
              {stat.value ?? "0"}
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              / {stat.target ?? "0"}
            </span>
          </div>

          {/* 하단 상태 바 */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">상태</span>
              <span className="text-[11px] font-black text-slate-700">
                {stat.status ?? "기록 없음"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


export default StatsCards;