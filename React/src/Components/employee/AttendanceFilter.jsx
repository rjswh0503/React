import React from 'react';
import { Calendar, Search, RefreshCw } from 'lucide-react';

const AttendanceFilter = ({ startDate, endDate, setStartDate, setEndDate, onSearch, onReset }) => {
    return (
        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <Calendar className="w-4 h-4 text-blue-500" />
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

            <div className="flex items-center gap-2">
                <button 
                    onClick={onSearch}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-black hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
                >
                    <Search className="w-3.5 h-3.5" />
                    조회하기
                </button>
                <button 
                    onClick={onReset}
                    className="p-2.5 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all active:rotate-180 duration-500"
                    title="초기화"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default AttendanceFilter;