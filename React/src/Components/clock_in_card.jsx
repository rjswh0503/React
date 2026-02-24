"use client"

import React, { useState, useEffect } from "react"
import api from "../api/api" // 실제 API 경로에 맞춰 수정하세요
import { Clock, LogIn, LogOut, CheckCircle2 } from "lucide-react"

export default function ClockInCard({ onAttendanceUpdate }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [attendance, setAttendance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // 오늘 출근 기록 불러오기
  const refreshAttendance = async () => {
    try {
      const response = await api.get("/api/attendance/today")
      setAttendance(response.data)
    } catch (error) {
      console.error("출퇴근 기록 조회 실패", error)
    }
  }

  useEffect(() => {
    refreshAttendance()
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 출근/퇴근 처리 함수 (생략된 로직은 이전과 동일하게 유지)
  const handleCheckIn = async () => {
    setIsLoading(true)
    try {
      await api.post("/api/attendance/check-in")
      await refreshAttendance()
      if (onAttendanceUpdate) onAttendanceUpdate()
      alert("출근 처리가 완료되었습니다.")
    } catch (e) { alert("출근 처리 실패") }
    finally { setIsLoading(false) }
  }

  const handleCheckOut = async () => {
    setIsLoading(true)
    try {
      await api.post("/api/attendance/check-out")
      await refreshAttendance()
      if (onAttendanceUpdate) onAttendanceUpdate()
      alert("퇴근 처리가 완료되었습니다.")
    } catch (e) { alert("퇴근 처리 실패") }
    finally { setIsLoading(false) }
  }

  // 근무 시간 및 진행률 계산 로직
  let elapsedHours = 0;
  let elapsedMinutes = 0;
  let progress = 0;

  if (attendance && attendance.checkInTime) {
    const checkInDate = new Date()
    const [h, m] = attendance.checkInTime.split(':').map(Number)
    checkInDate.setHours(h, m, 0, 0)

    const now = new Date()
    let diff = now.getTime() - checkInDate.getTime()

    if (attendance.checkOutTime) {
      const [oh, om] = attendance.checkOutTime.split(':').map(Number)
      const checkOutDate = new Date()
      checkOutDate.setHours(oh, om, 0, 0)
      diff = checkOutDate.getTime() - checkInDate.getTime()
    }

    if (diff > 0) {
      elapsedHours = Math.floor(diff / (1000 * 60 * 60))
      elapsedMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      // 9시간 근무 기준 (540분)
      progress = Math.min(100, Math.round(((elapsedHours * 60 + elapsedMinutes) / 540) * 100))
    }
  }

  const timeStr = currentTime.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
  const dateStr = currentTime.toLocaleDateString("ko-KR", { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })

  const isCheckedIn = attendance !== null
  const isCheckedOut = attendance?.checkOutTime !== null

  return (
    <div className="w-full bg-[#1A1C1E] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 border border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black tracking-tight">출퇴근 체크</h3>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isCheckedIn && !isCheckedOut ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
          {isCheckedIn && !isCheckedOut ? "Working" : isCheckedOut ? "Finished" : "Waiting"}
        </span>
      </div>

      {/* 실시간 시계 */}
      <div className="mb-8">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Current Time</p>
        <p className="text-5xl font-black tracking-tighter tabular-nums">{timeStr}</p>
        <p className="text-sm font-bold text-slate-400 mt-1">{dateStr}</p>
      </div>

      {/* 상태 정보 박스 */}
      <div className="flex items-center gap-4 bg-slate-800/40 p-5 rounded-3xl border border-white/5 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 shadow-inner">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-black text-slate-200">
            {isCheckedIn ? `${attendance.checkInTime?.substring(0, 5)} 출근 완료` : "출근 전입니다"}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">
            {isCheckedIn ? `${elapsedHours}시간 ${elapsedMinutes}분 근무 중` : "오늘의 업무를 시작하세요!"}
          </p>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="mb-8 px-1">
        <div className="flex justify-between text-[11px] font-black text-slate-500 mb-3 uppercase tracking-wider">
          <span>Daily Progress</span>
          <span className="text-blue-400">{progress}%</span>
        </div>
        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-slate-600 mt-2">
          <span>09:00</span>
          <span>18:00</span>
        </div>
      </div>

      {/* 액션 버튼 */}
      {!isCheckedIn ? (
        <button 
          onClick={handleCheckIn}
          disabled={isLoading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20"
        >
          <LogIn className="h-5 w-5" /> 출근하기
        </button>
      ) : !isCheckedOut ? (
        <button 
          onClick={handleCheckOut}
          disabled={isLoading}
          className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <LogOut className="h-5 w-5" /> 퇴근하기
        </button>
      ) : (
        <button disabled className="w-full py-4 bg-slate-800 text-slate-500 font-black rounded-2xl flex items-center justify-center gap-2 border border-slate-700">
          <CheckCircle2 className="h-5 w-5" /> 퇴근 완료
        </button>
      )}
    </div>
  )
}