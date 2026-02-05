import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const BoardAdd = () => {
    const navigate = useNavigate();
    const [board, setBoard] = useState({
        title: '',
        content: '',
        importance: '',
    });
    

    const handleChange = (e) => {
        setBoard({
            ...board,
            [e.target.name]: e.target.value
        });
    };

    const handleAdd = async (e) => {
        e.preventDefault();  // ← 추가!
        
        if (!board.title || !board.content) {
            alert("제목과 내용은 필수입니다.");
            return;
        }
        try {
            await api.post("/api/board/add", board);
            alert("게시글 등록 완료");
            navigate('/board/list');
        } catch (e) {
            console.error(e);
            alert("등록 실패: " + (e.response?.data || "오류 발생"));
        }
    };

    return (
        <div>
            <h1>공지사항 등록</h1>
            <form onSubmit={handleAdd}>  {/* ← form에 onSubmit */}
                <div>
                    <label>제목:</label>
                    <input type="text" name="title" value={board.title} onChange={handleChange} />
                </div>
                <div>
                    <label>내용:</label>
                    <textarea name="content" value={board.content} onChange={handleChange} />
                </div>
                <div>
                    <label>중요도:</label>
                    <select name="importance" value={board.importance} onChange={handleChange}>
                        <option value="">선택</option>
                        <option value="HIGH">높음</option>
                        <option value="NORMAL">중간</option>
                        <option value="LOW">낮음</option>
                    </select>
                </div>
                <button type="submit">등록</button>  {/* ← onSubmit 제거 */}
            </form>
        </div>
    );
};

export default BoardAdd;