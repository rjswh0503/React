
import React, { useState, useEffect} from 'react';
import axios from 'axios';



const Search = () => {
    const [keyword, setKeyword] = useState('');
    const [list, setList] = useState([]);



    const search = async () => {

        try {
            const response = await axios.get('http://localhost:8080/api/admin/users/search' + keyword);
            setList(response.data);
        } catch(e) {
            console.log("오류");
        }
    } 


    return (
        <div>
            <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            />
            <button className='hover:cursor-pointer hover:bg-black' onClick={search}>검색</button>
            

            {list.map(item => {
                <div key={item.id}>
                    {item.name}
                </div>
            })}
        </div>
    );
}


export default Search;