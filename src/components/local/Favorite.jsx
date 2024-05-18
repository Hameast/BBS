import React, { useEffect, useState } from 'react'
import {app} from '../../firebaseInit'
import { getDatabase, onValue, ref, remove } from 'firebase/database'
import { Table, Button } from 'react-bootstrap';

const Favorite = () => {
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);

    const uid=sessionStorage.getItem('uid');
    const db=getDatabase(app);
    const callAPI = () => {
        setLoading(true);
        onValue(ref(db, `favorite/${uid}`), snapshot=>{
            let rows=[];
            snapshot.forEach(row=>{
            rows.push({...row.val()});
            });
            setFavorites(rows);
            setLoading(false);
            // console.log(rows);
        });
        // console.log(favorites);
    }

    const onclickDelete = async(favorite) =>{
        if(window.confirm(`장바구니에서 빼시겠습니까?`)){
          //장바구니 삭제
          setLoading(true);
          await remove(ref(db, `favorite/${uid}/${favorite.id}`));
          setLoading(false);
        }
      }

    useEffect(()=>{
        callAPI();
    }, [])


    return (
        <div>
        <h3>즐겨찾기</h3>

        <Table striped bordered headers>
                <thead>
                    <tr className='text-center'>
                        <td>ID</td>
                        <td>장소명</td>
                        <td>주소</td>
                        <td>전화번호</td>
                        <td>삭제</td>
                    </tr>
                </thead>

                <tbody>
                    {favorites.map(favorite =>
                        <tr key={favorite.id}>
                            <td>{favorite.id}</td>
                            <td>{favorite.place_name}</td>
                            <td>{favorite.road_address_name}</td>
                            <td>{favorite.phone}</td>
                            <td className='text-center'><Button onClick={()=>onclickDelete(favorite)}>삭제</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default Favorite
