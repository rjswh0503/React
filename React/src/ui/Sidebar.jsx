import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  FileBarChart, 
  Settings, 
  Users, 
  Building2, 
  Bell 
} from "lucide-react";

const Sidebar = ({ isAdmin }) => {
  const location = useLocation();
  
  // 활성화 상태 확인 함수 (중첩 경로 포함)
  const isActive = (path) => {
    if (path === '/dashboard1') return location.pathname === '/dashboard1';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-slate-400 flex flex-col fixed left-0 top-0 z-50 border-r border-slate-800">
      
      {/* 로고 영역 */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">W</div>
        <span className="text-white font-bold tracking-tight">WORKHUB</span>
      </div>

      {/* 메뉴 리스트 */}
      <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto no-scrollbar">
        
        {/* [SECTION 1] Overview - 공통 메뉴 */}
        <div>
          <p className="px-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 italic">Overview</p>
          <div className="space-y-1">
            <Link to="/dashboard1" className="block">
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                location.pathname === '/dashboard1' ? 'bg-slate-800 text-white shadow-md' : 'hover:bg-slate-900 hover:text-slate-200'
              }`}>
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-sm font-medium">대시보드</span>
              </div>
            </Link>
            <Link to="/dashboard1/board/list" className="block">
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive('/dashboard1/board') ? 'bg-slate-800 text-white shadow-md' : 'hover:bg-slate-900 hover:text-slate-200'
              }`}>
                <Bell className="h-4 w-4" />
                <span className="text-sm font-medium">공지사항</span>
              </div>
            </Link>
          </div>
        </div>

        {/* [SECTION 2] Personal - 일반 유저용 (관리자가 아닐 때 노출) */}
        {!isAdmin && (
          <div>
            <p className="px-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 italic">Personal</p>
            <div className="space-y-1">
              <Link to="/dashboard1/attendance/me" className="block">
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive('/dashboard1/attendance/me') ? 'bg-slate-800 text-white shadow-md' : 'hover:bg-slate-900 hover:text-slate-200'
                }`}>
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">출퇴근 기록</span>
                </div>
              </Link>
              <Link to="/dashboard1/task" className="block">
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive('/dashboard1/task') ? 'bg-slate-800 text-white shadow-md' : 'hover:bg-slate-900 hover:text-slate-200'
                }`}>
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">근무 일정</span>
                </div>
              </Link>
              <Link to="/dashboard1/attendance/report/me" className="block">
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive('/dashboard1/attendance/report/me') ? 'bg-slate-800 text-white shadow-md' : 'hover:bg-slate-900 hover:text-slate-200'
                }`}>
                  <FileBarChart className="h-4 w-4" />
                  <span className="text-sm font-medium">근태 리포트</span>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* [SECTION 3] Management - 관리자 전용 메뉴 (isAdmin이 true일 때만 노출) */}
        {isAdmin && (
          <div>
            <p className="px-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 italic">Management</p>
            <div className="space-y-1">
              <Link to="/dashboard1/admin" className="block">
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive('/dashboard1/admin') ? 'bg-slate-800 text-white shadow-md' : 'hover:bg-slate-900 hover:text-slate-200'
                }`}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="text-sm font-medium">관리자 대시보드</span>
                </div>
              </Link>
              <Link to="/dashboard1/employees" className="block">
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive('/dashboard1/employees') ? 'bg-slate-800 text-white shadow-md' : 'hover:bg-slate-900 hover:text-slate-200'
                }`}>
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">사원 관리</span>
                </div>
              </Link>
              <Link to="/dashboard1/department" className="block">
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive('/dashboard1/department') ? 'bg-slate-800 text-white shadow-md' : 'hover:bg-slate-900 hover:text-slate-200'
                }`}>
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">부서 관리</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;