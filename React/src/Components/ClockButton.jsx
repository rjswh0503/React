import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function ClockButton() {
    const [status, setStatus] = useState({ checkedIn: false, checkedOut: false, inTime: null, outTime: null, loading: true, busy: false });

    useEffect(() => {
        let mounted = true;
        api.get('/api/attendance/today')
            .then(res => {
                if (!mounted) return;
                const data = res.data || {};
                setStatus(s => ({
                    ...s,
                    checkedIn: !!data.checkIn,
                    checkedOut: !!data.checkOut,
                    inTime: data.checkIn || null,
                    outTime: data.checkOut || null,
                    loading: false
                }));
            })
            .catch(err => {
                if (!mounted) return;
                const statusCode = err?.response?.status;
                if (statusCode === 401) {
                    alert('로그인이 필요합니다. 다시 로그인 해주세요.');
                    window.location.href = '/login';
                    return;
                }
                setStatus(s => ({ ...s, loading: false }));
            });

        return () => { mounted = false; };
    }, []);

    const refreshToday = async () => {
        try {
            const res = await api.get('/api/attendance/today');
            const data = res.data || {};
            setStatus(s => ({ ...s, checkedIn: !!data.checkIn, checkedOut: !!data.checkOut, inTime: data.checkIn || null, outTime: data.checkOut || null }));
        } catch (err) {
            // ignore
        }
    };

    const handleCheckIn = async () => {
        setStatus(s => ({ ...s, busy: true }));
        try {
            const res = await api.post('/api/attendance/check-in');
            const time = res.data?.time || new Date().toISOString();
            setStatus(s => ({ ...s, checkedIn: true, inTime: time }));
            alert(res.data?.message || '출근이 저장되었습니다.');
            await refreshToday();
        } catch (err) {
            console.error('check-in error', err);
            const msg = err?.response?.data?.message || err.message || '출근 저장 실패';
            if (err?.response?.status === 401) {
                alert('로그인이 필요합니다. 다시 로그인해 주세요.');
                window.location.href = '/login';
                return;
            }
            // 시도 후에도 서버에 저장되었을 수 있으니 상태 갱신을 시도합니다.
            alert(msg + '\n(에러가 발생했지만 실제로는 저장되었을 수 있습니다. 상태를 새로고침합니다.)');
            try { await refreshToday(); } catch(e){ console.error('refresh after failed check-in', e); }
        } finally {
            setStatus(s => ({ ...s, busy: false }));
        }
    };

    const handleCheckOut = async () => {
        setStatus(s => ({ ...s, busy: true }));
        try {
            const res = await api.post('/api/attendance/check-out');
            const time = res.data?.time || new Date().toISOString();
            setStatus(s => ({ ...s, checkedOut: true, outTime: time }));
            alert(res.data?.message || '퇴근이 저장되었습니다.');
            await refreshToday();
        } catch (err) {
            console.error('check-out error', err);
            const msg = err?.response?.data?.message || err.message || '퇴근 저장 실패';
            if (err?.response?.status === 401) {
                alert('로그인이 필요합니다. 다시 로그인해 주세요.');
                window.location.href = '/login';
                return;
            }
            alert(msg + '\n(에러가 발생했지만 실제로는 저장되었을 수 있습니다. 상태를 새로고침합니다.)');
            try { await refreshToday(); } catch(e){ console.error('refresh after failed check-out', e); }
        } finally {
            setStatus(s => ({ ...s, busy: false }));
        }
    };

    if (status.loading) return <div className='mt-auto py-4 text-center text-gray-300'>로딩...</div>;

    // Priority: not checked in -> show 출근; checked in && not checked out -> show 퇴근; completed -> show 완료
    return (
        <div>
            {!status.checkedIn && (
                <button onClick={handleCheckIn} disabled={status.busy} className='mb-3 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all w-full disabled:opacity-60'>
                    {status.busy ? '처리중...' : '출근'}
                </button>
            )}

            {status.checkedIn && !status.checkedOut && (
                <button onClick={handleCheckOut} disabled={status.busy} className='mb-3 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold transition-all w-full disabled:opacity-60'>
                    {status.busy ? '처리중...' : '퇴근'}
                </button>
            )}

            {status.checkedIn && status.checkedOut && (
                <button disabled className='mb-3 py-4 bg-gray-500 text-white rounded-2xl font-bold w-full'>
                    오늘 완료
                </button>
            )}

            <div className='text-[11px] text-gray-400 mt-2 text-center'>
                {status.inTime && <div>출근: {new Date(status.inTime).toLocaleTimeString()}</div>}
                {status.outTime && <div>퇴근: {new Date(status.outTime).toLocaleTimeString()}</div>}
            </div>
        </div>
    );
}
