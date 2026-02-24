"use client"

import React, { useEffect, useState } from "react"
import api from "../api/api";
import { 
    Clock, Calendar as CalendarIcon, CheckCircle2, 
    Plus, ChevronRight, UserSquare2, RotateCcw 
} from "lucide-react"

export default function SchedulePage({ user }) {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("daily") // daily, all
    const isAdmin = user?.role === 'ADMIN'

    // 데이터 로드
    const loadData = async () => {
        try {
            setLoading(true)
            const response = await api.get('/api/task')
            setTasks(response.data)
        } catch (error) {
            console.error("데이터 로드 실패", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    // 업무 상태 변경 핸들러
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.patch(`/api/task/${taskId}/status`, { status: newStatus })
            alert('상태가 변경되었습니다.')
            loadData()
        } catch (error) {
            alert('상태 변경에 실패했습니다.')
        }
    }

    // 담당자 변경 핸들러 (ADMIN)
    const handleAssigneeChange = async (taskId) => {
        const newUserId = prompt('새 담당자 ID를 입력하세요:')
        if (!newUserId) return
        try {
            await api.put(`/api/task/${taskId}/assignee`, { userId: Number(newUserId) })
            alert('담당자가 변경되었습니다.')
            loadData()
        } catch (error) {
            alert('변경 실패')
        }
    }

    // 상태별 색상 스타일
    const getStatusStyle = (status) => {
        switch (status) {
            case 'TODO': return 'bg-slate-100 text-slate-600 border-slate-200'
            case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'DONE': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
            default: return 'bg-gray-100 text-gray-600'
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 bg-white text-slate-900">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">근무 일정 및 업무 관리</h1>
                    <p className="text-sm text-slate-500 font-medium">전체 업무 현황과 일정을 한눈에 확인합니다.</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95">
                    <Plus className="h-4 w-4" />
                    일정 추가
                </button>
            </div>

            {/* 탭 메뉴 */}
            <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                <button 
                    onClick={() => setActiveTab("daily")}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "daily" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                    일별 요약
                </button>
                <button 
                    onClick={() => setActiveTab("all")}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                    전체 업무 리스트
                </button>
            </div>

            {/* 탭 콘텐츠: 일별 요약 */}
            {activeTab === "daily" && (
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            진행 중인 업무
                        </h3>
                        <div className="space-y-3">
                            {tasks.filter(t => t.status === 'IN_PROGRESS').map(task => (
                                <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="font-bold text-slate-800">{task.title}</p>
                                    <p className="text-xs text-slate-400 mt-1">{task.assigneeName} 담당</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            최근 완료 업무
                        </h3>
                        <div className="space-y-3">
                            {tasks.filter(t => t.status === 'DONE').slice(0, 3).map(task => (
                                <div key={task.id} className="bg-white/60 p-4 rounded-2xl border border-slate-100">
                                    <p className="font-bold text-slate-400 line-through">{task.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 탭 콘텐츠: 전체 리스트 */}
            {activeTab === "all" && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                                    <th className="px-6 py-4 uppercase text-[11px] tracking-wider">업무 정보</th>
                                    <th className="px-6 py-4 uppercase text-[11px] tracking-wider">담당자</th>
                                    <th className="px-6 py-4 uppercase text-[11px] tracking-wider text-center">상태</th>
                                    <th className="px-6 py-4 uppercase text-[11px] tracking-wider">기한</th>
                                    {isAdmin && <th className="px-6 py-4 uppercase text-[11px] tracking-wider text-right">관리</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">불러오는 중...</td></tr>
                                ) : tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{task.title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-medium text-slate-700">
                                                <UserSquare2 className="h-4 w-4 text-slate-300" />
                                                {task.assigneeName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <select 
                                                value={task.status}
                                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-[11px] font-black border transition-all outline-none appearance-none cursor-pointer ${getStatusStyle(task.status)}`}
                                            >
                                                <option value="TODO">대기</option>
                                                <option value="IN_PROGRESS">진행중</option>
                                                <option value="DONE">완료</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{task.dueDate || "-"}</td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleAssigneeChange(task.id)}
                                                    className="px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    담당 변경
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}