import React from 'react';
import { Calendar, Search, RefreshCw, Filter, ChevronDown } from 'lucide-react';

const AttendanceFilter = ({ 
    filterType, setFilterType, 
    startDate, setStartDate, 
    endDate, setEndDate, 
    selectedYear, setSelectedYear, 
    selectedMonth, setSelectedMonth, 
    selectedStatus, setSelectedStatus,
    statusOptions,
    onSearch, onReset 
}) => {
    return (
        <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-[2rem] border border-slate-200 shadow-sm shadow-slate-50 transition-all">
            
            {/* 1. 조회 방식 선택 (Type Selector) */}
            <div className="relative flex items-center bg-slate-100/50 rounded-2xl p-1">
                <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="appearance-none bg-transparent pl-4 pr-10 py-2 text-xs font-black text-slate-700 outline-none cursor-pointer z-10"
                >
                    <option value="period">📅 기간별</option>
                    <option value="month">🗓️ 월별</option>
                    <option value="status">🔍 상태별</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
            </div>

            <div className="h-6 w-[1.5px] bg-slate-100 mx-1 hidden sm:block" />

            {/* 2. 동적 입력 영역 (Dynamic Input Area) */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 min-h-[40px]">
                {filterType === 'period' && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer"
                        />
                        <span className="text-slate-300 font-bold">~</span>
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer"
                        />
                    </div>
                )}

                {filterType === 'month' && (
                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                        <select 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer"
                        >
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}년</option>)}
                        </select>
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer"
                        >
                            {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}월</option>)}
                        </select>
                    </div>
                )}

                {filterType === 'status' && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <Filter className="w-3.5 h-3.5 text-blue-500" />
                        <select 
                            value={selectedStatus} 
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer pr-4"
                        >
                            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                )}
            </div>

            {/* 3. 액션 버튼 영역 */}
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
                <button 
                    onClick={onSearch}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                    <Search className="w-3.5 h-3.5" />
                    조회하기
                </button>
                <button 
                    onClick={onReset}
                    className="p-2.5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 hover:text-slate-600 transition-all active:rotate-180 duration-500"
                    title="초기화"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default AttendanceFilter;