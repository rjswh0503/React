import React from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';





const DeleteButton = ({ boardId }) => {

    const navigate = useNavigate();

    const handleDelete = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                // boardId를 사용합니다.
                await api.delete(`/api/board/${boardId}`); 
                alert("게시글이 삭제되었습니다.");
                navigate('/dashboard1/board/list');
                
            } catch (e) {
                console.error(e);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    }
    
    return (
        <button onClick={handleDelete} className="text-red-500 hover:text-red-700 hover:underline cursor-pointer">
            <span>삭제</span>
        </button>
    )
}

export default DeleteButton;