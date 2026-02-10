import React, { useState, useEffect } from 'react';
import api from '../api/api';

const TaskList = ({ user }) => {
    const [taskList, setTaskList] = useState([]);
    const isAdmin = user?.role === 'ADMIN';

    // 업무 목록 조회
    const fetchTaskList = async () => {
        try {
            const response = await api.get('/api/task');
            setTaskList(response.data);
        } catch (error) {
            console.error('업무 목록 조회 실패:', error);
            alert('업무 목록을 불러오는데 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchTaskList();
    }, []);

    //  상태 변경 핸들러
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.patch(`/api/task/${taskId}/status`, { status: newStatus });
            alert('상태가 변경되었습니다.');
            fetchTaskList();
        } catch (error) {
            console.error('상태 변경 실패:', error);
            alert('상태 변경에 실패했습니다.');
        }
    };

    //  담당자 변경 핸들러 (ADMIN 전용)
    const handleAssigneeChange = async (taskId) => {
        const newUserId = prompt('새 담당자 ID를 입력하세요:');
        if (!newUserId) return;

        try {
            await api.put(`/api/task/${taskId}/assignee`, {
                userId: Number(newUserId)
            });
            alert('담당자가 변경되었습니다.');
            fetchTaskList();
        } catch (error) {
            console.error('담당자 변경 실패:', error);
            alert('담당자 변경에 실패했습니다.');
        }
    };

    //  상태별 색상
    const getStatusColor = (status) => {
        switch (status) {
            case 'TODO': return 'bg-gray-200 text-gray-800';
            case 'IN_PROGRESS': return 'bg-blue-200 text-blue-800';
            case 'DONE': return 'bg-green-200 text-green-800';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">업무 목록</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">제목</th>
                        <th className="border border-gray-300 p-2">설명</th>
                        <th className="border border-gray-300 p-2">담당자</th>
                        <th className="border border-gray-300 p-2">상태</th>
                        <th className="border border-gray-300 p-2">기한</th>
                        {isAdmin && <th className="border border-gray-300 p-2">작업</th>}
                    </tr>
                </thead>
                <tbody>
                    {taskList.map((task) => (
                        <tr key={task.id}>
                            <td className="border border-gray-300 p-2">{task.title}</td>
                            <td className="border border-gray-300 p-2">{task.description}</td>
                            <td className="border border-gray-300 p-2">{task.assigneeName}</td>
                            <td className="border border-gray-300 p-2">
                                {/*  상태 변경 드롭다운 */}
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    className={`p-1 rounded ${getStatusColor(task.status)}`}
                                >
                                    <option value="TODO">대기</option>
                                    <option value="IN_PROGRESS">진행중</option>
                                    <option value="DONE">완료</option>
                                </select>
                            </td>
                            <td className="border border-gray-300 p-2">{task.dueDate}</td>
                            {isAdmin && (
                                <td className="border border-gray-300 p-2">
                                    {/*  담당자 변경 버튼 (ADMIN만) */}
                                    <button
                                        onClick={() => handleAssigneeChange(task.id)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        담당자 변경
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskList;