import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Layout, Calendar, FileText, User, Info, CheckCircle } from "lucide-react";

const TaskCreate = ({ user }) => {
    const isAdmin = user?.role === 'ADMIN';
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        employeeId: ''
    });

    useEffect(() => {
        if (isAdmin) {
            fetchEmployees();
        }
    }, [isAdmin]);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/api/admin/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('조회 실패:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const submitData = {
            ...taskData,
            employeeId: isAdmin ? taskData.employeeId : user?.employeeId,
            userId: user?.id
        };

        try {
            await api.post('/api/task', submitData);
            alert('업무가 성공적으로 등록되었습니다!');
            setTaskData({
                title: '', description: '', 
                dueDate: new Date().toISOString().split('T')[0], 
                employeeId: ''
            });
        } catch (error) {
            alert('업무 등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 font-sans">
            {/* 상단 타이틀 섹션 */}
            <div className="flex items-center justify-between mb-8">
                <div className="text-left">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">새 업무 등록</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase mt-1">New Task Assignment</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900">
                    <FileText className="w-6 h-6" />
                </div>
            </div>

            {/* 카드 형태의 폼 */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    
                    {/* 업무 제목 */}
                    <div className="space-y-2 text-left">
                        <label className="text-[11px] font-black text-slate-400 uppercase ml-1">업무 제목</label>
                        <div className="relative">
                            <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                name="title"
                                value={taskData.title}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900"
                                placeholder="업무 명칭을 입력하세요"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* 마감일 */}
                        <div className="space-y-2 text-left">
                            <label className="text-[11px] font-black text-slate-400 uppercase ml-1">마감 기한</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={taskData.dueDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900"
                                />
                            </div>
                        </div>

                        {/* 담당자 선택 (관리자 전용) */}
                        {isAdmin && (
                            <div className="space-y-2 text-left">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">담당 사원</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        name="employeeId"
                                        value={taskData.employeeId}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="">담당자 선택</option>
                                        {employees.map((emp) => (
                                            <option key={emp.employeeId} value={emp.employeeId}>
                                                {emp.name} ({emp.position})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 업무 설명 */}
                    <div className="space-y-2 text-left">
                        <label className="text-[11px] font-black text-slate-400 uppercase ml-1">업무 상세 내용</label>
                        <textarea
                            name="description"
                            value={taskData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full p-5 bg-slate-50 border border-slate-50 rounded-3xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900 resize-none"
                            placeholder="업무에 대한 구체적인 지시사항을 입력하세요"
                        />
                    </div>

                    {/* 안내 문구 */}
                    {!isAdmin && (
                        <div className="bg-blue-50/50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100/50">
                            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div className="text-left">
                                <p className="text-xs font-black text-blue-900 uppercase">Notice</p>
                                <p className="text-[11px] text-blue-600 font-bold mt-0.5">본인이 담당하는 업무로 즉시 등록됩니다.</p>
                            </div>
                        </div>
                    )}

                    {/* 등록 버튼 */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white font-black rounded-[1.5rem] hover:bg-black shadow-xl shadow-slate-200 transition-all uppercase text-xs tracking-widest active:scale-95 disabled:bg-slate-400"
                    >
                        {loading ? "Registering..." : "Create Task"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskCreate;