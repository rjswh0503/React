
import React from 'react';
// 작성하신 컴포넌트들을 경로에 맞춰 import 하세요
import  StateCard  from "../../Components/StateCard"; 
import Chart from "../../Components/Chart";


const Attendance = () => {
    return (
        <div className="min-h-screen bg-slate-50/50 p-6">
            {/* 1. 헤더 섹션 */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">근태 관리 현황</h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                    실시간 출퇴근 통계 및 지각 추이를 확인합니다.
                </p>
            </div>

            {/* 2. 상단 통계 카드 (StatsCards) */}
            <div className="mb-6">
                <StateCard />
            </div>

            {/* 3. 하단 차트 섹션 (그리드 배치) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 지각 발생 추이 - 왼쪽 (넓게 2칸 차지) */}
                <div className="lg:col-span-2">
                    <LateTrendChart />
                </div>

                {/* 근태 상태 비율 - 오른쪽 (1칸 차지) */}
                <div className="lg:col-span-1">
                    <StatusPieChart />
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