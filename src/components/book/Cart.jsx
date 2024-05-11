import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import {app} from '../../firebaseInit'
import { getDatabase, onValue, ref, remove } from 'firebase/database'

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  const uid=sessionStorage.getItem('uid');
  const db=getDatabase(app);
  const callAPI = () => {
    setLoading(true);
    onValue(ref(db, `cart/${uid}`), snapshot=>{
      const rows=[];
      snapshot.forEach(row=>{
        rows.push({...row.val()});
      });
      setBooks(rows);
      setLoading(false);
      console.log(rows);
    });
    console.log(books);
  }

  const onclickDelete = (book) =>{
    if(window.confirm(`${book.title}를 장바구니에서 빼시겠습니까?`)){
      //장바구니 삭제
      remove(ref(db, `cart/${uid}/${book.isbn}`));
    }
  }

  useEffect(()=>{
    callAPI();
  }, [])

  if(loading) return <h1 className='my-5'>로딩중입니다...</h1>
  return (
    <div>
      <h1 className='my-2'>장바구니</h1>
      <Table>
        <thead>
          <tr>
            <td colSpan={2}>도서제목</td>
            <td>가격</td>
            <td>저자</td>
            <td>삭제</td>
          </tr>
        </thead>

        <tbody>
          {books.map(book=>
            <tr key={book.isbn}>
              <td><img src={book.thumbnail} width="50px"></img></td>
              <td>{book.title}</td>
              <td>{book.price}</td>
              <td>{book.authors}</td>
              <td><Button onClick={()=>onclickDelete(book)} variant='danger' className='btn-sm'>삭제</Button></td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default Cart
