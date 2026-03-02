
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import Login from './page1/login';
import Register from './page1/register';
import { AuthProvider } from './context/Auth.jsx';

// 레이아웃 및 메인 컨텐츠
import DashboardLayout from './page1/Dashboard1.jsx';
import HomeDashboard from './page1/HomeDashboard.jsx';

// 게시판 관련
import BoardList from './board/boardList';
import BoardDetail from './board/BoardDetail';
import BoardUpdate from './board/BoardUpdate.jsx';
import BoardAdd from './board/BoardAdd.jsx';
import ImportanceBoard from './Components/dashBoardMain/ImportanceBoard.jsx';

// 근태 관련
import AttendanceRecords from './Components/dashBoardMain/Attendance.jsx';
import AttendanceReport from './page1/attendance/Attendance.jsx';

// 관리자 및 사원 관리
import EmployeeManagement from './page1/admin/EmployeeManagement.jsx';
import AdminDashboard from './page1/admin/AdminDashboard.jsx';
import DepartmentManagement from './page1/admin/DepartmentManagement.jsx';
import EmployeeAttendance from './Components/employee/EmployeeAttendance.jsx';

// 기타
import Setting from './page1/Setting.jsx';
import TaskList from './page1/TaskList.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 기본 경로 설정 */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin/register' element={<Register />} />

          {/* 통합 대시보드 구조 (DashboardLayout 사용) */}
          <Route path='/dashboard1' element={<DashboardLayout />}>
            <Route index element={<HomeDashboard />} />

            {/* 게시판 서브 경로 */}
            <Route path='board/list' element={<BoardList />} />
            <Route path='board/add' element={<BoardAdd />} />
            <Route path='board/:id' element={<BoardDetail />} />
            <Route path='board/importance' element={<ImportanceBoard />} />
            <Route path='board/edit/:id' element={<BoardUpdate />} />

            {/* 근태 서브 경로 */}
            <Route path='attendance/me' element={<div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"><AttendanceRecords /></div>} />
            <Route path='attendance/report/me' element={<div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-4"><AttendanceReport /></div>} />

            {/* 업무 및 기타 */}
            <Route path='task' element={<div className="bg-white rounded-[2rem] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"><TaskList /></div>} />
            <Route path='mypage' element={<div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)]"><Setting /></div>} />

            {/* 관리자 전용 */}
            <Route path='admin' element={<AdminDashboard />} />
            <Route path='employees' element={<EmployeeManagement />} />
            <Route path='department' element={<DepartmentManagement />} />
            <Route path='/dashboard1/employee/:id/attendance' element={<EmployeeAttendance/>}/>
          </Route>

          {/* 404 처리 (필요시 추가) */}
          <Route path="*" element={<Navigate to="/dashboard1" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
