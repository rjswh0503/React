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
            // 백엔드 @PutMapping("/me") 호출
            // EmployeeUpdateDto 필드명에 맞춰서 데이터 전송
            await api.put('/api/userinfo/me', {
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
            await api.put('/api/userinfo/password', {
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
        <div className="max-w-3xl mx-auto p-8 space-y-12 text-left bg-transparent">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">계정 설정</h1>
                <p className="text-gray-400 mt-2 font-medium text-sm">개인 정보 및 보안 설정을 관리하세요.</p>
            </div>

            <div className="grid gap-8">
                {/* 개인 정보 수정 섹션 */}
                <section className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 p-8 transition-all relative overflow-hidden text-left">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">개인 정보 수정</h2>
                        <p className="text-sm text-gray-400 font-medium">기본적인 연락처 정보를 관리합니다.</p>
                    </div>
                    <form onSubmit={handleInfoSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-black">사번 (수정 불가)</label>
                                <input
                                    type="text"
                                    value={user.employeeNo || ""}
                                    disabled
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 cursor-not-allowed font-mono text-sm outline-none"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-black">이름</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 cursor-not-allowed text-sm outline-none"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-black">이메일 주소</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="workhub@company.com"
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-sm placeholder:text-gray-300"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-black">전화번호</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="010-1234-5678"
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-sm placeholder:text-gray-300"
                            />
                        </div>

                        <div className="flex justify-start pt-4 border-t border-gray-50">
                            <button type="submit" className="px-8 py-3.5 bg-black hover:bg-gray-800 text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-black/10 text-sm">
                                내 정보 저장
                            </button>
                        </div>
                    </form>
                </section>

                {/* 비밀번호 변경 섹션 */}
                <section className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 p-8 transition-all relative overflow-hidden text-left">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">비밀번호 보안</h2>
                        <p className="text-sm text-gray-400 font-medium">안전한 서비스 이용을 위해 비밀번호를 주기적으로 변경하세요.</p>
                    </div>
                    <form onSubmit={handlePwdSave} className="space-y-6">
                        <div className="group">
                            <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-black">현재 비밀번호</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-sm placeholder:text-gray-300"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-black">새 비밀번호</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-sm placeholder:text-gray-300"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-black">새 비밀번호 확인</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-sm placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        <div className="flex justify-start pt-4 border-t border-gray-50">
                            <button type="submit" className="px-8 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition-all active:scale-[0.98] text-sm">
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