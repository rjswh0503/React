import React from 'react';
import UserDropdown from './UserDropdown';

const Navbar = () => {
  return (
    <nav className="h-16 w-full bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      
      {/* 1. 좌측 영역 (필요 시 서비스명이나 로고 배치, 현재는 비워둠) */}
      <div className="flex items-center">
        {/* <span className="font-bold text-slate-800">WorkHub</span> */}
      </div>

      {/* 2. 우측 영역 (오직 드롭다운만 위치) */}
      <div className="flex items-center">
        {/* 여기에 직접 만드신 UserDropdown 컴포넌트를 넣으세요 */}
        <div className="flex items-center gap-3">
            
            {/* 드롭다운 컴포넌트 위치 예시 */}
            <div className="relative">
               <UserDropdown/>
            </div>
        </div>
      </div>
      
    </nav>
  );
}

export default Navbar;