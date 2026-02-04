import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Employee = () => {
    const [employee, setEmployee] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await api.get('/api/admin/employees');
                setEmployee(responseData.data);
            } catch(e) {
                console.error("데이터 가져오기 실패", e);
            }
        };  // ← 여기서 fetchData 함수 끝
        
        fetchData();  // ← 여기서 호출
    }, []);

    return (
        <div style={{ padding: '20px' }}>
           
            <table border="1" style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                textAlign: 'left'
            }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th style={{ padding: '12px', width: '11%' }}>사원번호</th>
                        <th style={{ padding: '12px', width: '11%' }}>이름</th>
                        <th style={{ padding: '12px', width: '20%' }}>이메일</th>
                        <th style={{ padding: '12px', width: '20%' }}>전화번호</th>
                        <th style={{ padding: '12px', width: '10%' }}>직급</th>
                        <th style={{ padding: '12px', width: '15%' }}>부서</th>
                        <th style={{ padding: '12px', width: '15%' }}>입사일</th>
                    </tr>
                </thead>
                <tbody>
                    {employee.filter(emp => emp.role !== 'ADMIN' && emp.position !== '관리자').map(emp => (
                        <tr key={emp.id}>
                            <td style={{ padding: '12px', width: '10%' }}>{emp.employeeNo}</td>
                            <td style={{ padding: '12px', width: '10%' }}>{emp.name}</td>
                            <td style={{ padding: '12px', width: '20%' }}>{emp.email}</td>
                            <td style={{ padding: '12px', width: '15%' }}>{emp.phone}</td>
                            <td style={{ padding: '12px', width: '10%' }}>{emp.position}</td>
                            <td style={{ padding: '12px', width: '15%' }}>
                                {emp.department?.departName || '관리자'}
                            </td>
                            <td style={{ padding: '10px', width: '15%' }}>{emp.joinDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Employee;