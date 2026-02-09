import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useParams } from 'react-router-dom';
import { UserIcon, CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

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
            <div className='mx-auto max-w-4xl px-6 py-10'>
                <div className='mb-6'>
                    <Link to="/home">Back to list</Link>
                </div>
                <article className='rounded-lg border border-gray-300  bg-card'>
                    <div className='px-8 pt-8 pb-6'>
                        <div className='flex items-center gap-2 mb-4'>

                            <span className='shrink-0 text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded'>
                                {detail.importance}
                            </span>
                        </div>


                        <h1 className='text-2xl font-bold tracking-tight text-card-foreground leading-relaxed text-balance'>{detail.title}</h1>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <UserIcon className="h-3.5 w-3.5" />
                                {detail.position}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                {new Date(detail.createdAt).toLocaleDateString('ko-KR').slice(0, -1)}
                            </span>
                            
                        </div>
                        <div className='px-8 py-8'>
                            <div className='whitespace-pre-wrap text-[15px] leading-relaxed text-card-foreground/90'>
                                {detail.content}
                            </div>
                        </div>

                        <div>
                        </div>



                    </div>

                </article>
            </div>




        </>

    )

}

export default BoardDetail;