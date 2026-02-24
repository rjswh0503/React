"use client"

import React from "react"
import { useLocation } from "react-router-dom"
import { useAuth } from "../context/Auth.jsx" // 실제 경로에 맞게 수정하세요

export default function DashboardHeader() {
  const { user } = useAuth()
  const location = useLocation()

  // 현재 경로에 따른 타이틀 매핑
  const getTitle = (path) => {
    if (path === "/admin") return "관리자 대시보드"
    if (path.includes("/admin/employees")) return "사원 관리"
    if (path.includes("/admin/departments")) return "부서 관리"
    if (path.includes("/attendance")) return "출퇴근 기록"
    if (path.includes("/schedule")) return "근무 일정"
    if (path.includes("/report")) return "근태 리포트"
    if (path.includes("/settings")) return "설정"
    return "대시보드"
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md px-8 sticky top-0 z-40">
      {/* 왼쪽: 타이틀 및 상태 배지 */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          {getTitle(location.pathname)}
        </h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
          근무중
        </span>
      </div>

      {/* 오른쪽: 사용자 프로필 영역 */}
      <div className="flex items-center gap-4">
        {/* 프로필 정보 (이름, 부서/직급) */}
        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm font-black text-slate-900 leading-none">
            {user?.name || "사용자"}
          </p>
          <p className="mt-1.5 text-[11px] font-bold text-slate-400">
            {user?.department?.departName || "부서미정"} <span className="mx-1 text-slate-200">|</span> {user?.position || "직급미정"}
          </p>
        </div>

        {/* 아바타 (Avatar 대체) */}
        <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 transition-transform hover:scale-105 cursor-pointer">
          <span className="text-xs font-black uppercase">
            {user?.name ? user.name.slice(0, 2) : "UN"}
          </span>
        </div>
      </div>
    </header>
  )
}