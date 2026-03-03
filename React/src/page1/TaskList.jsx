"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Clock, Calendar as CalendarIcon, CheckCircle2, 
    Plus, ChevronRight, RotateCcw, X, ListTodo, 
    AlertCircle, LayoutDashboard, CalendarDays
} from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/Auth.jsx";

const statusStyles = {
    TODO: "bg-slate-100 text-slate-500 border-slate-200",
    IN_PROGRESS: "bg-blue-50 text-blue-600 border-blue-100",
    DONE: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

export default function SchedulePage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("daily");
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [inputs, setInputs] = useState({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'TODO'
    });

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/task');
            setTasks(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("데이터 로드 실패", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...inputs, userId: user?.id, employeeId: user?.employeeId };
            await api.post("/api/task", payload);
            alert("일정이 등록되었습니다.");
            setIsRegModalOpen(false);
            setInputs({ title: '', description: '', dueDate: new Date().toISOString().split('T')[0], status: 'TODO' });
            loadData();
        } catch (e) {
            alert("등록 실패: 정보를 확인해주세요.");
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.patch(`/api/task/${taskId}/status`, { status: newStatus });
            loadData();
        } catch (error) {
            alert('상태 변경 실패');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700 bg-slate-50/30 min-h-screen space-y-8 text-left">
            {/* 1. 헤더 섹션 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-xl">
                            <CalendarDays className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Schedule & Tasks</h1>
                    </div>
                    <p className="text-sm text-slate-400 font-medium italic">근무 일정 및 업무 프로세스를 체계적으로 관리합니다.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex p-1 bg-slate-100 rounded-2xl">
                        <button onClick={() => setActiveTab("daily")} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "daily" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>DAILY</button>
                        <button onClick={() => setActiveTab("all")} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>ALL TASKS</button>
                    </div>
                    <button
                        onClick={() => setIsRegModalOpen(true)}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-xs font-black shadow-xl shadow-slate-200 transition-all active:scale-95 uppercase tracking-widest"
                    >
                        <Plus className="h-4 w-4" /> Add Task
                    </button>
                </div>
            </div>

            {/* 2. 대시보드 요약 (일별 요약 탭) */}
            {activeTab === "daily" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* 진행 중 섹션 */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-xl"><Clock className="w-5 h-5 text-blue-500" /></div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">In Progress</h3>
                            </div>
                            <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                                {tasks.filter(t => t.status === 'IN_PROGRESS').length} Active
                            </span>
                        </div>
                        
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === 'IN_PROGRESS').length === 0 ? (
                                <p className="py-12 text-center text-slate-300 font-bold italic text-sm">진행 중인 업무가 없습니다.</p>
                            ) : (
                                tasks.filter(t => t.status === 'IN_PROGRESS').map(task => (
                                    <div key={task.id} className="group bg-slate-50 hover:bg-white p-5 rounded-2xl border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default">
                                        <div className="flex justify-between items-start">
                                            <p className="font-black text-slate-800 leading-tight">{task.title}</p>
                                            <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">
                                                {task.assigneeName || '담당자 미정'}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-300">{task.dueDate}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 완료 섹션 */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-xl"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Recent Done</h3>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === 'DONE').length === 0 ? (
                                <p className="py-12 text-center text-slate-300 font-bold italic text-sm">최근 완료된 업무가 없습니다.</p>
                            ) : (
                                tasks.filter(t => t.status === 'DONE').slice(0, 5).map(task => (
                                    <div key={task.id} className="flex items-center justify-between p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100/50">
                                        <p className="font-bold text-slate-400 line-through text-sm">{task.title}</p>
                                        <div className="px-2 py-1 bg-white rounded-lg text-[9px] font-black text-emerald-600 border border-emerald-100">COMPLETED</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 3. 전체 리스트 (테이블) */}
            {activeTab === "all" && (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Information</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Due Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm font-sans">
                                {loading ? (
                                    <tr><td colSpan="3" className="px-8 py-20 text-center text-slate-300 font-black animate-pulse uppercase">Analyzing Records...</td></tr>
                                ) : (
                                    tasks.map((task) => (
                                        <tr key={task.id} className="hover:bg-slate-50/50 transition-all group">
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-800">{task.title}</p>
                                                <p className="text-xs text-slate-400 mt-1 italic">{task.description || 'No description available.'}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black border transition-all outline-none cursor-pointer shadow-sm ${statusStyles[task.status]}`}
                                                    >
                                                        <option value="TODO">대기</option>
                                                        <option value="IN_PROGRESS">진행중</option>
                                                        <option value="DONE">완료</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right font-mono text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                                                {task.dueDate || "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 4. 등록 모달 (디자인 업그레이드) */}
            {isRegModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsRegModalOpen(false)}></div>
                    <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Create New Task</h3>
                                    <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest italic opacity-60">신규 업무 일정을 등록합니다.</p>
                                </div>
                                <button type="button" onClick={() => setIsRegModalOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors bg-white p-3 rounded-full border border-slate-100 shadow-sm">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-10 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Title</label>
                                    <input name="title" value={inputs.title} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-xs font-black focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-slate-900" required placeholder="업무 제목을 입력하세요" />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
                                        <input type="date" name="dueDate" value={inputs.dueDate} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-xs font-black focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Status</label>
                                        <select name="status" value={inputs.status} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-xs font-black focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900 appearance-none cursor-pointer">
                                            <option value="TODO">대기 (TODO)</option>
                                            <option value="IN_PROGRESS">진행중</option>
                                            <option value="DONE">완료</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                    <textarea name="description" value={inputs.description} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-xs font-black focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900 resize-none" rows="4" placeholder="상세 내용을 입력하세요" />
                                </div>
                            </div>

                            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                                <button type="button" onClick={() => setIsRegModalOpen(false)} className="flex-1 py-5 bg-white border border-slate-200 text-slate-400 font-black rounded-3xl hover:bg-slate-100 transition-all uppercase text-[10px] tracking-widest">Close</button>
                                <button type="submit" className="flex-1 py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black shadow-2xl shadow-slate-200 transition-all uppercase text-[10px] tracking-widest">Save Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}