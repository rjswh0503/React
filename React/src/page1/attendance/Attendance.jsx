import React, { useState, useEffect } from 'react';
import StateCard from "../../Components/StateCard";
import Chart from "../../Components/Chart";
import api from '../../api/api';

const Attendance = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const [ticker, setTicker] = useState(0);

    const fetchRecords = async (isSilent = false) => {
        try {
            if (!isSilent) setLoading(true);
            const response = await api.get('/api/attendance/me');
            setRecords(response.data || []);
        } catch (error) {
            console.error("근태 데이터 로드 실패:", error);
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();

        // 10초마다 서버 데이터 동기화
        const pollId = setInterval(() => {
            fetchRecords(true);
        }, 10000);

        // 1초마다 화면 강제 리렌더링 (실시간 시간 계산용)
        const tickerId = setInterval(() => {
            setTicker(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(pollId);
            clearInterval(tickerId);
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50/50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-bold">실시간 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-6">
            {/* 1. 헤더 섹션 */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">실시간 근태 리포트</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                        활동 데이터를 실시간으로 집계하여 시각화된 리포트를 제공합니다.
                    </p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl flex items-center gap-2 animate-pulse">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs font-black uppercase tracking-wider">Live Syncing</span>
                </div>
            </div>

            {/* 2. 상단 통계 카드 (StatsCards) */}
            <div className="mb-6">
                <StateCard records={records} />
            </div>

            {/* 3. 하단 차트 섹션 (그리드 배치) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 주간 근무 시간 추이 - 왼쪽 (넓게 2칸 차지) */}
                <div className="lg:col-span-2">
                    <Chart type="workTrend" records={records} />
                </div>

                {/* 근태 상태 비율 - 오른쪽 (1칸 차지) */}
                <div className="lg:col-span-1">
                    <Chart type="statusPie" records={records} />
                </div>

            </div>

            {/* (선택사항) 4. 추가 데이터 영역 - 예: 최근 지각자 명단 등 */}
            <div className="mt-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Notice</h3>
                <p className="text-xs text-slate-500">
                    * 모든 데이터는 실시간 전산 기록을 바탕으로 집계됩니다. 오차 발생 시 관리자에게 문의하세요.
                </p>
            </div>
        </div>
    )
}

export default Attendance;