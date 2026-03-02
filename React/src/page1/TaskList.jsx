"use client"

import React, { useEffect, useState } from "react"
import api from "../api/api";
import {
    Clock, Calendar as CalendarIcon, CheckCircle2,
    Plus, ChevronRight, UserSquare2, RotateCcw, X
} from "lucide-react"

import { useAuth } from "../context/Auth.jsx";

export default function SchedulePage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("daily")

    // 모달 관련 상태
    const [isRegModalOpen, setIsRegModalOpen] = useState(false)
    const [inputs, setInputs] = useState({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'TODO'
    });

    const isAdmin = user?.role === 'ADMIN'

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

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    // 일정 등록 제출 핸들러
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            // 현재 로그인한 사용자의 정보를 포함하여 전송
            const payload = {
                ...inputs,
                userId: user?.id,
                employeeId: user?.employeeId
            };
            await api.post("/api/task", payload);
            alert("일정이 성공적으로 등록되었습니다.");
            setIsRegModalOpen(false);
            setInputs({
                title: '',
                description: '',
                dueDate: new Date().toISOString().split('T')[0],
                status: 'TODO'
            });
            loadData(); // 목록 새로고침
        } catch (e) {
            console.error("일정 등록 실패 상세:", e);
            const errorMsg = e.response?.data?.message || e.response?.data || "입력 정보를 확인해주세요.";
            alert(`등록 실패: ${errorMsg}`);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.patch(`/api/task/${taskId}/status`, { status: newStatus })
            alert('상태가 변경되었습니다.')
            loadData()
        } catch (error) {
            alert('상태 변경에 실패했습니다.')
        }
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'TODO': return 'bg-slate-100 text-slate-600 border-slate-200'
            case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'DONE': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
            default: return 'bg-gray-100 text-gray-600'
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 bg-white text-slate-900 font-sans">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">근무 일정 및 업무 관리</h1>
                    <p className="text-sm text-slate-500 font-medium">전체 업무 현황과 일정을 한눈에 확인합니다.</p>
                </div>
                {/* 일정 추가 버튼: 클릭 시 모달 오픈 */}
                <button
                    onClick={() => setIsRegModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-sm transition-all active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    일정 추가
                </button>
            </div>

            {/* 탭 메뉴 */}
            <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                <button onClick={() => setActiveTab("daily")} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "daily" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>일별 요약</button>
                <button onClick={() => setActiveTab("all")} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>전체 업무 리스트</button>
            </div>

            {/* 탭 콘텐츠: 일별 요약 */}
            {activeTab === "daily" && (
                <div className="grid gap-6 md:grid-cols-2 text-left">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            진행 중인 업무
                        </h3>
                        <div className="space-y-3 text-left">
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
                                    <p className="font-bold text-slate-400 line-through text-left">{task.title}</p>
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
                                    <th className="px-6 py-4 uppercase text-[11px] tracking-wider text-center">상태</th>
                                    <th className="px-6 py-4 uppercase text-[11px] tracking-wider">기한</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-400">불러오는 중...</td></tr>
                                ) : tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{task.title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ✅ 일정 등록 모달 (사원 관리 모달 스타일 적용) */}
            {isRegModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsRegModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 animate-in fade-in zoom-in duration-200">
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 text-left">일정 등록</h3>
                                    <p className="text-[13px] text-gray-400 font-medium mt-1 text-left">새로운 일정을 생성합니다.</p>
                                </div>
                                <button type="button" onClick={() => setIsRegModalOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="group text-left">
                                    <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-black">업무 제목</label>
                                    <input name="title" value={inputs.title} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-sm placeholder:text-gray-300" required placeholder="업무 제목을 입력하세요" />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="group text-left">
                                        <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-black">기한</label>
                                        <input type="date" name="dueDate" value={inputs.dueDate} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-sm" required />
                                    </div>
                                    <div className="group text-left">
                                        <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-black">초기 상태</label>
                                        <select name="status" value={inputs.status} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-sm appearance-none cursor-pointer">
                                            <option value="TODO">대기 (TODO)</option>
                                            <option value="IN_PROGRESS">진행중</option>
                                            <option value="DONE">완료</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="group text-left">
                                    <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-black">상세 설명</label>
                                    <textarea name="description" value={inputs.description} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-sm placeholder:text-gray-300 resize-none" rows="3" placeholder="업무에 대한 상세 설명을 입력하세요" />
                                </div>
                            </div>

                            <div className="p-8 bg-transparent flex justify-end gap-3 border-t border-gray-50">
                                <button type="button" onClick={() => setIsRegModalOpen(false)} className="px-6 py-3 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all text-sm">취소</button>
                                <button type="submit" className="px-6 py-3 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 shadow-xl shadow-black/10 transition-all active:scale-[0.98] text-sm flex items-center gap-2">
                                    등록
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}