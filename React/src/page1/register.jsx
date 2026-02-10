import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

import { HiUserAdd, HiOutlineIdentification, HiOutlineUser, HiOutlineOfficeBuilding, HiOutlineMail, HiOutlinePhone, HiOutlineCalendar } from 'react-icons/hi';

function Register() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    employeeNo: '',
    name: '',
    password: '1111',
    departNo: '',
    position: '',
    email: '',
    phone: '',
    joinDate: ''
  });

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    if (!inputs.employeeNo || !inputs.name || !inputs.joinDate) {
      alert("사번, 이름, 입사일은 필수입니다!");
      return;
    }

    try {
      await api.post('/api/admin/register', inputs);
      alert(`[${inputs.name}] 사원 등록이 완료되었습니다!`);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("등록 실패: " + (err.response?.data || "오류 발생"));
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3 flex items-center">
            <HiUserAdd className="mr-4 text-blue-600" /> 사원 등록
          </h1>
          <p className="text-gray-500 font-medium">시스템에 새로운 구성원을 추가합니다. 모든 정보는 인사 기록으로 관리됩니다.</p>
        </div>

        {/* 등록 폼 카드 */}
        <div className="bg-white border border-gray-100 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* 내부 패딩 섹션 */}
          <div className="p-10 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              
              {/* 사번 */}
              <InputGroup 
                label="사원번호 *" 
                name="employeeNo" 
                value={inputs.employeeNo} 
                onChange={handleChange} 
                placeholder="8자리 숫자 입력" 
                icon={<HiOutlineIdentification />}
              />

              {/* 이름 */}
              <InputGroup 
                label="성명 *" 
                name="name" 
                value={inputs.name} 
                onChange={handleChange} 
                placeholder="실명 입력" 
                icon={<HiOutlineUser />}
              />

              {/* 부서 */}
              <InputGroup 
                label="부서코드" 
                name="departNo" 
                value={inputs.departNo} 
                onChange={handleChange} 
                placeholder="ex) 1" 
                icon={<HiOutlineOfficeBuilding />}
              />

              {/* 직급 */}
              <InputGroup 
                label="직급" 
                name="position" 
                value={inputs.position} 
                onChange={handleChange} 
                placeholder="ex) 사원, 대리" 
                icon={<HiOutlineUser />}
              />

              {/* 이메일 */}
              <InputGroup 
                label="이메일" 
                name="email" 
                type="email" 
                value={inputs.email} 
                onChange={handleChange} 
                placeholder="company@mail.com" 
                icon={<HiOutlineMail />}
              />

              {/* 전화번호 */}
              <InputGroup 
                label="연락처" 
                name="phone" 
                value={inputs.phone} 
                onChange={handleChange} 
                placeholder="010-0000-0000" 
                icon={<HiOutlinePhone />}
              />

              {/* 입사일 (Full Width) */}
              <div className="md:col-span-2">
                <InputGroup 
                  label="입사일 *" 
                  name="joinDate" 
                  type="date" 
                  value={inputs.joinDate} 
                  onChange={handleChange} 
                  icon={<HiOutlineCalendar />}
                />
              </div>
            </div>

            {/* 안내 텍스트 */}
            <div className="mt-10 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center">
              <span className="text-blue-600 mr-3">💡</span>
              <p className="text-sm text-blue-700 font-medium">
                초기 비밀번호는 <span className="font-bold underline">1111</span>로 자동 설정됩니다. 로그인 후 변경을 권장하세요.
              </p>
            </div>

            {/* 등록 버튼 */}
            <button
              onClick={handleRegister}
              className="w-full mt-10 bg-black hover:bg-gray-800 text-white rounded-2xl h-16 flex items-center justify-center transition-all active:scale-[0.98] shadow-xl shadow-black/10 group"
            >
              <span className="text-lg font-black mr-2">사원 등록 완료</span>
              <HiUserAdd className="text-xl group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 하단 푸터 */}
        <div className="text-center mt-12 mb-20 text-gray-300 font-bold text-xs uppercase tracking-[0.3em]">
          Human Resources Management System
        </div>
      </div>
    </div>
  );
}

/**
 * 모던한 디자인의 입력 그룹 컴포넌트
 */
function InputGroup({ label, name, value, onChange, placeholder, type = "text", icon }) {
  return (
    <div className="flex flex-col">
      <label className="text-[13px] font-black text-gray-400 uppercase tracking-wider mb-3 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-black transition-colors">
          {icon}
        </div>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm"
        />
      </div>
    </div>
  );
}

export default Register;