import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { Button } from "flowbite-react";
import { initFlowbite } from 'flowbite';

const Login = () => {
    const [inputs, setInputs] = useState({
        employeeNo: '',
        password: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        initFlowbite();
    }, []);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        try {
            await api.post('/api/login', inputs);
            alert("로그인 성공");
            navigate("/home");
        } catch (e) {
            alert("로그인 실패: 사번이나 비밀번호를 확인해주세요.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
            {/* 메인 로그인 컨테이너: 약간 더 넓은 라운드와 깊이감 있는 그림자 */}
            <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-10 transition-all">
                
                {/* 로고 및 상단 헤더 */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl mb-6 shadow-lg shadow-gray-200">
                        <span className="text-white text-xl font-black">H</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">로그인</h1>
                    <p className="text-gray-400 text-sm font-medium">서비스 이용을 위해 사번을 입력해 주세요</p>
                </div>

                {/* 입력 필드 섹션 */}
                <div className="space-y-5">
                    <div className="group">
                        <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-black">
                            사원번호
                        </label>
                        <input
                            name='employeeNo'
                            type="text"
                            placeholder="사번을 입력하세요"
                            value={inputs.employeeNo}
                            onChange={handleChange}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-sm placeholder:text-gray-300"
                        />
                    </div>
                    
                    <div className="group">
                        <div className="flex justify-between items-center mb-2 ml-1">
                            <label className="text-[13px] font-bold text-gray-700 transition-colors group-focus-within:text-black">
                                비밀번호
                            </label>
                            <Link to="/find-password" title="비밀번호 찾기" className="text-xs text-gray-400 hover:text-black transition-colors">
                                비밀번호 찾기
                            </Link>
                        </div>
                        <input
                            name='password'
                            type='password'
                            placeholder="••••••••"
                            value={inputs.password}
                            onChange={handleChange}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all duration-200 text-sm placeholder:text-gray-300"
                        />
                    </div>
                </div>

                {/* 로그인 버튼: 모던한 블랙 풀 버튼 */}
                <button 
                    onClick={handleLogin}
                    className="w-full mt-10 bg-black hover:bg-gray-800 text-white rounded-2xl h-14 flex items-center justify-center transition-all active:scale-[0.98] shadow-xl shadow-black/10"
                >
                    <span className="text-[16px] font-bold">로그인</span>
                </button>

                {/* 하단 안내 문구 */}
                <div className="mt-10 text-center">
                    <p className="text-[13px] text-gray-400 font-medium">
                        계정 문제 발생 시 
                        <span className="text-black font-bold ml-1.5 cursor-pointer underline underline-offset-4 decoration-gray-200 hover:decoration-black transition-all">
                            관리자에게 문의
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;