import React, { useState } from 'react';
import api from '../api/api';

const TaskCreate = ({ user }) => {  // ← user props 받기!
    const isAdmin = user?.role === 'ADMIN';  // 관리자 여부 확인

    // 입력 데이터 저장
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        dueDate: '',
        employeeId: ''  // 관리자만 입력
    });

    // 입력값 변경 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({
            ...taskData,
            [name]: value
        });
    };

    // 업무 등록 API 호출
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ========== 디버깅 코드 시작 ==========
        console.log('디버깅 시작');
        console.log('user prop:', user);
        console.log('user?.id:', user?.id);
        console.log('user?.employeeId:', user?.employeeId);
        console.log('isAdmin:', isAdmin);
        // ========== 디버깅 코드 끝 ==========

        // 제출 데이터 준비
        const submitData = {
            title: taskData.title,
            description: taskData.description,
            dueDate: taskData.dueDate,
            // 관리자: 입력한 employeeId 사용, 일반 사용자: 본인 employeeId
            employeeId: isAdmin ? taskData.employeeId : user?.employeeId,
            userId: user?.id  // 항상 로그인한 사용자
        };

        // ========== 전송 데이터 확인 ==========
        console.log('전송할 데이터:', submitData);
        console.log('employeeId 값:', submitData.employeeId);
        console.log('userId 값:', submitData.userId);
        // ========== 확인 끝 ==========

        try {
            const response = await api.post('/api/task', submitData);
            alert('업무가 등록되었습니다!');
            // 입력 필드 초기화
            setTaskData({
                title: '',
                description: '',
                dueDate: '',
                employeeId: ''
            });
        } catch (error) {
            console.error('업무 등록 실패:', error);
            alert('업무 등록에 실패했습니다.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">업무 등록</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 업무 제목 */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        업무 제목
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={taskData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="업무 제목을 입력하세요"
                    />
                </div>

                {/* 업무 설명 */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        업무 설명
                    </label>
                    <textarea
                        name="description"
                        value={taskData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="업무 설명을 입력하세요"
                    />
                </div>

                {/* 마감일 */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        마감일
                    </label>
                    <input
                        type="date"
                        name="dueDate"
                        value={taskData.dueDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* 관리자만: 사원 ID 입력 */}
                {isAdmin && (
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            사원 ID (employeeId)
                        </label>
                        <input
                            type="number"
                            name="employeeId"
                            value={taskData.employeeId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="할당할 사원 ID를 입력하세요"
                        />
                    </div>
                )}

                {/* 일반 사용자: 안내 메시지 */}
                {!isAdmin && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">
                             본인에게 업무가 자동으로 할당됩니다.
                        </p>
                    </div>
                )}

                {/* 등록 버튼 */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    업무 등록
                </button>
            </form>
        </div>
    );
};

export default TaskCreate;