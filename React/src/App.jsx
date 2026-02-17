
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './index.css';
import Login from './page1/login';
import Register from './page1/register';
import Home from './page1/home';
import Good from './page1/good';
import BoardList from './board/boardList';
import BoardDetail from './board/BoardDetail';
import ImportanceBoard from './board/ImportanceBoard';
import { AuthProvider } from './context/Auth.jsx';
import BoardUpdate from './board/BoardUpdate.jsx';

function App() {

  return (
    
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin/register' element={<Register/>} />
        <Route path='/home' element={<Home/>}/>
        <Route path='/good' element={<Good/>}/>
        <Route path='/board/list' element={<BoardList/>}/>
        <Route path='/board/:id' element={<BoardDetail/>}/>
        <Route path='/board/importance' element={<ImportanceBoard/>}/>
        <Route path='/board/edit/:id' element={<BoardUpdate/>}/>
      </Routes>
      </AuthProvider>
    </BrowserRouter>

  )
}

export default App
