import React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AlertCircle, TrendingUp, UserCheck, Clock } from "lucide-react"

const Chart = ({ type = "workTrend", records = [] }) => {
  // 1. 주간 근무 시간 데이터 계산 (월~일)
  const getWorkTrendData = () => {
    const now = new Date();
    const day = now.getDay(); // 0(일) ~ 6(토)

    // 이번 주 월요일 찾기
    const monday = new Date(now);
    const diffToMon = day === 0 ? -6 : 1 - day;
    monday.setDate(now.getDate() + diffToMon);

    // 월~일 날짜 배열 생성 (7일)
    const weekDays = [...Array(7)].map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });

    // 오늘 날짜 (로컬 기준)
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    return weekDays.map(date => {
      const record = records.find(r => r.workDate === date);
      let hours = 0;

      if (record) {
        if (record.workHours > 0) {
          hours = record.workHours;
        } else if (date === todayStr && record.checkInTime && !record.checkOutTime) {
          // 오늘 출근은 했으나 퇴근 전인 경우 실시간 계산
          try {
            const [h, m, s] = record.checkInTime.split(':').map(Number);
            const checkInDate = new Date();
            checkInDate.setHours(h, m, s || 0, 0);
            const diffMs = new Date() - checkInDate;
            if (diffMs > 0) hours = diffMs / (1000 * 60 * 60);
          } catch (e) {
            console.error(e);
          }
        }
      }

      const d = new Date(date);
      const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
      return {
        date: `${date.slice(5)} (${dayNames[d.getDay()]})`,
        hours: hours
      };
    });
  };

  // 2. 근태 상태 데이터 계산 (전체 비율)
  const getPieData = () => {
    if (records.length === 0) return [
      { name: '데이터 없음', value: 100, color: '#e2e8f0' }
    ];

    const counts = records.reduce((acc, r) => {
      const status = r.status || '기타';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const colors = {
      '정상': '#3b82f6',
      '지각': '#f59e0b',
      '결근': '#ef4444',
      '휴가': '#10b981',
      '조퇴': '#8b5cf6'
    };

    return Object.keys(counts).map(key => ({
      name: key,
      value: Math.round((counts[key] / records.length) * 100),
      color: colors[key] || '#94a3b8'
    }));
  };

  const trendData = type === "workTrend" ? getWorkTrendData() : [];
  const pieData = type === "statusPie" ? getPieData() : [];

  if (type === "statusPie") {
    return (
      <div className="w-full h-full rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><UserCheck className="h-5 w-5" /></div>
          <div>
            <h3 className="text-lg font-black text-slate-900">근태 비율</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase">Average Status</p>
          </div>
        </div>

        <div className="h-[250px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-3">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-slate-500">{item.name}</span>
              </div>
              <span className="text-slate-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalHours = trendData.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="w-full rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Clock className="h-5 w-5" /></div>
          <div>
            <h3 className="text-lg font-black text-slate-900">한 주의 근무 시간</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Weekly Work Hours</p>
          </div>
        </div>

        <div className="flex flex-col items-end bg-slate-50 px-4 py-2 rounded-2xl">
          <div className="flex items-center gap-1 text-blue-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-2xl font-black italic">
              {totalHours.toFixed(1)}h
            </span>
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">TOTAL</p>
        </div>
      </div>

      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="workGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }}
              dy={10}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} />
            <Tooltip
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px' }}
              labelStyle={{ fontWeight: 'black', color: '#64748b' }}
              formatter={(value) => [`${value.toFixed(1)}h`, '근무 시간']}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#3b82f6"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#workGradient)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Chart;