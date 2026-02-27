import React from "react"
import { CalendarCheck, Clock, TrendingUp, Coffee } from "lucide-react"

const StatsCards = () => {
  // UI 확인용 정적 데이터 구조
  const stats = [
    {
      label: "이번 주 근무시간",
      value: "32h 45m",
      target: "40h",
      status: "정상",
      color: "text-slate-900",
      icon: Clock,
    },
    {
      label: "이번 달 출근일",
      value: "15일",
      target: "20일",
      status: "출근 중",
      color: "text-blue-600",
      icon: CalendarCheck,
    },
    {
      label: "이번 달 초과근무",
      value: "2h 15m",
      target: "한도 52h",
      status: "없음",
      color: "text-slate-900",
      icon: TrendingUp,
    },
    {
      label: "잔여 연차",
      value: null, // 데이터가 없는 경우 처리 확인용
      target: "데이터 연동 필요",
      status: null,
      color: "text-slate-400",
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
              {stat.value ?? "정보 없음"}
            </h3>
            {stat.value && (
              <span className="text-xs font-semibold text-slate-400">
                / {stat.target}
              </span>
            )}
          </div>

          {/* 하단 상태 바 */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">상태</span>
              <span className="text-[11px] font-black text-slate-700">
                {stat.status ?? "미연동"}
              </span>
            </div>
            
            {!stat.value && (
              <span className="animate-pulse text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                Waiting
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}


export default StatsCards;