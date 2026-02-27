import React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertCircle, TrendingUp } from "lucide-react"

const Chart = () => {
  // 나중에 서버 데이터로 교체할 더미 데이터 구조
  const data = [
    { date: '02-21', count: 2 },
    { date: '02-22', count: 4 },
    { date: '02-23', count: 3 },
    { date: '02-24', count: 9 }, // 피크 지점
    { date: '02-25', count: 5 },
    { date: '02-26', count: 2 },
    { date: '02-27', count: 1 },
  ]

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* 상단 헤더 영역 */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">지각 발생 추이</h3>
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100">
              <AlertCircle className="h-3 w-3" />
              주의 요망
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">최근 7일간의 지각 데이터 집계</p>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-amber-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-2xl font-black italic">26</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Weekly Total</p>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              {/* 노란색/주황색 계열 그라데이션 */}
              <linearGradient id="lateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#f1f5f9" 
            />
            
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8' }}
            />
            
            <Tooltip 
              cursor={{ stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                padding: '12px'
              }}
              labelStyle={{ fontWeight: 'bold', color: '#64748b', marginBottom: '4px' }}
              itemStyle={{ color: '#b45309', fontWeight: 'bold' }}
              formatter={(value) => [`${value}명`, '지각자']}
            />

            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#f59e0b" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#lateGradient)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 하단 요약 안내 */}
      <div className="mt-6 rounded-xl bg-slate-50 p-3 flex items-center justify-between">
        <p className="text-[11px] text-slate-500 font-medium">
          지난 주 대비 <span className="text-amber-600 font-bold">+12%</span> 증가했습니다.
        </p>
        <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
          상세 리포트 보기 &gt;
        </button>
      </div>
    </div>
  )
}

export default Chart;