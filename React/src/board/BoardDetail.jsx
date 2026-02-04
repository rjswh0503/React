import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useParams } from 'react-router-dom';

const BoardDetail = () => {
    const [detail, setDetail] = useState(null);
    const { id } = useParams();



    useEffect(() => {

        const fetchData = async () => {

            try {

                const response = await api.get(`/api/board/${id}`)
                console.log("받아온 데이터:", response.data);
                setDetail(response.data);

            } catch (e) {
                console.error("에러", e);
                console.error('에러 발생!');
                console.log('에러 상세:', error.response?.data);  // ✅ 이거 확인!
                console.log('상태 코드:', error.response?.status);
                console.log('요청 URL:', error.config?.url);
            }
        }

        fetchData();


    }, [id]);

    if (!detail) {
        return <div>데이터를 불러오는 중입니다...</div>;
    }




    return (
        <>
            <div>
                <div>
                    <p>{detail.title}</p>
                    <p>{detail.content}</p>
                    <p>{detail.position}</p>
                    <div>
                        
                        <span className='shrink-0 text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded'>
                            {detail.importance}
                        </span>
                    </div>

                    <p>{new Date(detail.createdAt).toLocaleDateString('ko-KR').slice(0, -1)}</p>
                </div>



            </div>

        </>

    )

}

export default BoardDetail;