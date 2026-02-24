"use client"

import React, { useEffect, useState } from "react"
import api from "../../api/api"
import { 
    Clock, Plus, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, UserSquare2 
} from "lucide-react"

export default function SchedulePage({ user }) {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("daily")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date()) 
    
    const isAdmin = user?.role === 'ADMIN'

    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        dueDate: '',
        employeeId: ''
    })

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

    useEffect(() => { loadData() }, [])

    // 캘린더 날짜 렌더링
    const renderCalendar = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);
        for (let d = 1; d <= lastDate; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
            const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === month;
            const hasTask = tasks.some(t => t.dueDate === dateStr);

            days.push(
                <div 
                    key={d} 
                    onClick={() => setSelectedDate(new Date(year, month, d))}
                    className={`relative h-10 w-full flex items-center justify-center rounded-xl cursor-pointer text-sm font-bold transition-all
                        ${isSelected ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-slate-100 text-slate-700'}
                        ${isToday && !isSelected ? 'text-blue-600 ring-1 ring-blue-100' : ''}`}
                >
                    {d}
                    {hasTask && <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />}
                </div>
            );
        }
        return days;
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'TODO': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'DONE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-gray-100 text-gray-600';
        }
    }

    return (
        <div className="w-full flex flex-col gap-6 p-6 bg-white text-slate-900 min-h-screen">
            {/* 1. 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">근무 일정 관리</h1>
                    <p className="text-sm text-slate-500 font-medium">부서 및 개인 업무 일정을 관리합니다.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-sm transition-all"
                >
                    <Plus className="h-4 w-4" /> 일정 추가
                </button>
            </div>

            {/* 2. 탭 메뉴 */}
            <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                <button onClick={() => setActiveTab("daily")} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "daily" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>일별 요약</button>
                <button onClick={() => setActiveTab("all")} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>전체 리스트</button>
            </div>

            {/* 3. 메인 콘텐츠 (좌우 분할) */}
            {activeTab === "daily" ? (
                <div className="flex flex-col xl:flex-row gap-8 items-start">
                    
                    {/* [좌측] 캘린더 영역 (고정 너비) */}
                    <div className="w-full xl:w-[400px] shrink-0 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-slate-900">{selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월</h3>
                            <div className="flex gap-1 text-slate-400">
                                <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                                <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronRight className="h-5 w-5" /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {renderCalendar()}
                        </div>
                    </div>

                    {/* [우측] 일정 상세 영역 (남은 너비 전부) */}
                    <div className="flex-1 w-full space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Clock className="h-5 w-5" /></div>
                            <h3 className="text-xl font-black">{selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 일정</h3>
                        </div>

                        <div className="space-y-4">
                            {tasks.filter(t => t.dueDate === selectedDate.toISOString().split('T')[0]).length > 0 ? (
                                tasks.filter(t => t.dueDate === selectedDate.toISOString().split('T')[0]).map(task => (
                                    <div key={task.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-slate-900 transition-all duration-300">
                                        <div className="space-y-1">
                                            <p className="text-lg font-black text-slate-900">{task.title}</p>
                                            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                                <span className="flex items-center gap-1.5"><UserSquare2 className="h-4 w-4 text-slate-300" /> {task.assigneeName}</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                <span>{task.description}</span>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2.5rem] p-20 text-center">
                                    <CalendarIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold">선택된 날짜에는 예정된 업무가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* 전체 리스트 (표 형식) */
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">업무 정보</th>
                                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider text-center">상태</th>
                                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider text-right">기한</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tasks.map(task => (
                                <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900">{task.title}</p>
                                        <p className="text-xs text-slate-400">{task.assigneeName} 담당</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getStatusStyle(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-500 font-mono font-medium">{task.dueDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 등록 모달 (생략 - 기존 모달 코드 그대로 사용) */}
        </div>
    )
}