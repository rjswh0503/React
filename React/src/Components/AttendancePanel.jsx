import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function AttendancePanel() {
    const [data, setData] = useState({ rows: [], loading: true, error: null });

    useEffect(() => {
        let mounted = true;
        api.get('/api/attendance/me')
            .then(res => {
                if (!mounted) return;
                setData({ rows: res.data || [], loading: false, error: null });
            })
            .catch(err => {
                if (!mounted) return;
                setData({ rows: [], loading: false, error: '불러오기 실패' });
            });

        return () => { mounted = false; };
    }, []);

    if (data.loading) return <div className='p-6 text-gray-500'>로딩 중...</div>;
    if (data.error) return <div className='p-6 text-red-500'>{data.error}</div>;

    // Simple summary
    const totalDays = data.rows.length;
    const daysWithIn = data.rows.filter(r => r.checkIn).length;

    return (
        <div>
            <div className='mb-6 flex items-center justify-between'>
                <h3 className='text-lg font-black'>이번달 출근 현황</h3>
                <div className='text-sm text-gray-500'>총 기록: {totalDays} / 출근한 날: {daysWithIn}</div>
            </div>

            <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='text-xs text-gray-400 border-b'>
                            <th className='py-3 px-2'>날짜</th>
                            <th className='py-3 px-2'>출근</th>
                            <th className='py-3 px-2'>퇴근</th>
                            <th className='py-3 px-2'>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((row, i) => (
                            <tr key={i} className='text-sm border-b hover:bg-gray-50'>
                                <td className='py-3 px-2'>{row.date}</td>
                                <td className='py-3 px-2'>{row.checkIn ? new Date(row.checkIn).toLocaleTimeString() : '-'}</td>
                                <td className='py-3 px-2'>{row.checkOut ? new Date(row.checkOut).toLocaleTimeString() : '-'}</td>
                                <td className='py-3 px-2'>{row.checkIn ? '출근' : '결근'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
