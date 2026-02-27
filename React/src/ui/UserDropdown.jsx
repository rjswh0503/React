import React from 'react';
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem  } from 'flowbite-react'; // 👈 핵심: Dropdown 하나만 가져옵니다.
import  FlowbiteAvatar  from './Avatar';
import { useAuth } from '../context/Auth';
import { useNavigate, Link } from 'react-router-dom';


const UserDropdown = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    }



    return (
        
        <Dropdown 
            label={<FlowbiteAvatar name={user?.name}/>} 
            inline 
            arrowIcon={false}
        >
            <DropdownHeader>
                <span className='block text-sm font-bold text-slate-900'>{user?.name || '사용자'}</span>
                <span className='block truncate text-xs font-medium text-slate-500'>{user?.email || '이메일'}</span>
                <span className='block truncate text-xs font-medium text-slate-500'>{user?.position || '직급'}</span>
            </DropdownHeader>

            <DropdownItem><Link to="/dashboard1/mypage">내 정보</Link></DropdownItem>
            <DropdownDivider/>
            <DropdownItem onClick={handleLogout} className="text-red-600 font-bold">
                로그아웃
            </DropdownItem>
        </Dropdown>
    );
}

export default UserDropdown;