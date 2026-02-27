
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './index.css';
import Login from './page1/login';
import Register from './page1/register';
import DashBoard from './page1/DashBoard.jsx';
import Good from './page1/good';
import BoardList from './board/boardList';
import BoardDetail from './board/BoardDetail';
import ImportanceBoard from './Components/dashBoardMain/ImportanceBoard.jsx';
import { AuthProvider } from './context/Auth.jsx';
import BoardUpdate from './board/BoardUpdate.jsx';
import DashBoard1 from './page1/Dashboard1.jsx';
import MainContent from './Components/dashBoardMain/MainContent.jsx';
import BoardAdd from './board/BoardAdd.jsx';
import Attendance from './Components/dashBoardMain/Attendance.jsx';
import EmployeeManagement from './page1/admin/EmployeeManagement.jsx';
import Setting from './page1/Setting.jsx';
import TaskList from './page1/TaskList.jsx';
import AdminDashboard from './page1/admin/AdminDashboard.jsx';
import AttendanceME from './page1/attendance/Attendance.jsx';

function App() {

  return (
    
    <BrowserRouter>
    <AuthProvider>
      <Routes>
  <Route path='/login' element={<Login/>}/>
  <Route path='/admin/register' element={<Register/>} />
  <Route path='/dashboard1' element={<DashBoard1 />}>
    <Route index element={<MainContent />} /> 
    <Route path='board/list' element={<BoardList/>}/>
    <Route path='board/add' element={<BoardAdd/>}/>
    <Route path='board/:id' element={<BoardDetail/>}/>
    <Route path='board/importance' element={<ImportanceBoard/>}/>
    <Route path='board/edit/:id' element={<BoardUpdate/>}/>
    <Route path='attendance/me' element={<Attendance/>}/>
    <Route path='attendance/report/me' element={<AttendanceME/>}/>
    <Route path='employees' element={<EmployeeManagement/>}/>
    <Route path='mypage' element={<Setting/>}/>
    <Route path='task' element={<TaskList/>}/>
    <Route path='adminDashboard' element={<AdminDashboard/>}/>
  </Route>
  <Route path='/dashboard' element={<DashBoard/>}/>
</Routes>
      </AuthProvider>
    </BrowserRouter>

  )
}

export default App
