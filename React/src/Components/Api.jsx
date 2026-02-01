import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Api = () => {

    const [data, setData] = useState([]);


    const fetchData = async () => {
        try {
            const response = await axios.get('https://koreanjson.com/users');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);

        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    return (
        <div style={{textAlign: 'center'}}>
            <p>---- 사용자 정보 ----</p>
            {data.map((user) => (
                <ul key={user.id}>

                    <>
                        
                        <li>이름: {user.name}</li>
                        <li>이메일: {user.email}</li>
                        <li>전화번호: {user.phone}</li>
                        <li>웹사이트: {user.website}</li>
                        <li>지역: {user.province}</li>

                    </>

                </ul>
            ))}
        </div>
    )

}

export default Api;