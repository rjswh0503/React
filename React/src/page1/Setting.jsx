import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/Auth';
import api from '../api/api';

const Setting = () => {
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
        }
    }, [user]);

    // 1. 개인정보 수정 핸들러
    const handleInfoSave = async (e) => {
        e.preventDefault();
        try {
            // 백엔드 @PutMapping("/me/edit") 호출
            // EmployeeUpdateDto 필드명에 맞춰서 데이터 전송
            await api.put('/api/employees/me/edit', {
                name: name,
                email: email,
                phone: phone
            }, { withCredentials: true });

            alert("내 정보가 성공적으로 수정되었습니다.");
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert(err.response?.data || "정보 수정 중 오류가 발생했습니다.");
        }
    };

    // 2. 비밀번호 수정 핸들러
    const handlePwdSave = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("새 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        try {
            // 백엔드 @PutMapping("/password") 호출
            // PasswordChangeDto의 필드명인 currentPassword와 newPassword를 사용
            await api.put('/api/employees/password', {
                currentPassword: oldPassword, // 백엔드 DTO 필드명 매칭
                newPassword: newPassword
            }, { withCredentials: true });

            alert("비밀번호가 성공적으로 변경되었습니다.");
            window.location.reload();
            // 입력창 초기화
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error(err);
            // 백엔드에서 던지는 ResponseEntity.body 메시지를 출력
            alert(err.response?.data || "비밀번호 변경 실패");
        }
    };

    if (!user) return <div className="p-10 text-center">로딩 중...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-10 text-left">
            <div className="border-b border-gray-200 pb-5">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">계정 설정</h1>
                <p className="text-gray-500 mt-2 font-medium">개인 정보 및 보안 설정을 관리하세요.</p>
            </div>

            <div className="grid gap-8">
                {/* 개인 정보 수정 섹션 */}
                <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-left">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 font-bold text-gray-800">
                        개인 정보 수정
                    </div>
                    <form onSubmit={handleInfoSave} className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-700">사번 (수정 불가)</label>
                                <input 
                                    type="text"
                                    value={user.employeeNo || ""}
                                    disabled 
                                    className="p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed font-mono text-sm outline-none" 
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-700">이름</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled
                                    className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700">이메일 주소</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="workhub@company.com"
                                className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700">전화번호</label>
                            <input 
                                type="text" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="010-1234-5678"
                                className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            />
                        </div>

                        <div className="flex justify-start pt-2">
                            <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                내 정보 저장
                            </button>
                        </div>
                    </form>
                </section>

                {/* 비밀번호 변경 섹션 */}
                <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-left">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 font-bold text-gray-800">
                        비밀번호 보안
                    </div>
                    <form onSubmit={handlePwdSave} className="p-6 space-y-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700">현재 비밀번호</label>
                            <input 
                                type="password" 
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="현재 비밀번호 입력"
                                className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-700">새 비밀번호</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="새 비밀번호 입력"
                                    className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-700">새 비밀번호 확인</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="새 비밀번호 다시 입력"
                                    className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                />
                            </div>
                        </div>

                        <div className="flex justify-start pt-2">
                            <button type="submit" className="px-8 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                                비밀번호 변경
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default Setting;