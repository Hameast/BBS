import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {Row, Col, Card, InputGroup, Form, Button} from 'react-bootstrap'
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import {app} from '../../firebaseInit'
import {getDatabase, ref, set, get} from 'firebase/database'

const Books = () => {
  const db = getDatabase(app);

  const navi = useNavigate();
  const uid=sessionStorage.getItem('uid');
  const [end, setEnd] = useState(2);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("리액트");
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  const callAPI = async() => {
    setLoading(true);
    const url=`https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
    const config={
      headers:{"Authorization":"KakaoAK 008dde331175330016234ac303721b99"}
    };
    const res=await axios.get(url, config);
    // console.log(res.data);
    setBooks(res.data.documents)
    setEnd(res.data.meta.is_end)
    setLoading(false);
  };

  useEffect(()=>{
    callAPI();
  }, [page]);

  const onSubmit = (e) =>{
    e.preventDefault();
    setPage(1);
    callAPI();
  }

  const onClickCart = (book) =>{
    if(uid){
      //장바구니에 도서 넣기
      if(window.confirm(`${book.title} 도서를 장바구니에 넣으시겠습니까?`)){
        //장바구니에 이미 있는 지 확인
        get(ref(db, `cart/${uid}/${book.isbn}`)).then(snapshot=>{
          if(snapshot.exists()){
            alert("이미 장바구니에 담은 도서입니다.");
          }
          else{
            set(ref(db, `cart/${uid}/${book.isbn}`), {...book});
            alert("장바구니에 넣었습니다.");
          }
        });
      }
    }
    else{
      sessionStorage.setItem('target', '/books');
      navi('/login');
    }
  }

  if(loading) return <h1 className='my-5'>로딩중입니다...</h1>
  return (
    <div>
      <h1 className='my-5'>도서검색</h1>
      <Row className='mb-2'>
        <Col xs={8} md={6} lg={4}>
          <form onSubmit={onSubmit}>
            <InputGroup>
              <Form.Control placeholder='검색어' value={query} onChange={(e) =>setQuery(e.target.value)}/>
              <Button type='submit'>검색</Button>
            </InputGroup>
          </form>
        </Col>
      </Row>

      <Row>
        {books.map(book=>
          <Col key={book.isbn} xs={6} md={3} lg={2} className='mb-2'>
            <Card>
              <Card.Body className='justify-content-center d-flex'>
                <img width="90%" src={book.thumbnail || 'http://via.placeholder.com/120x170'}></img>
              </Card.Body>
              <Card.Footer>
                <div className='ellipsis'>{book.title}</div>
                <FaShoppingCart onClick={()=>onClickCart(book)} style={{cursor:'pointer', fontSize:'20px', color:'green'}}></FaShoppingCart>
              </Card.Footer>
            </Card>
          </Col>
        )}
      </Row>

      <div className='text-center my-3'>
        <Button onClick={()=>setPage(page-1)} disabled={page === 1}>이전</Button>
        <span className='mx-2'>{page}</span>
        <Button onClick={()=>setPage(page+1)} disabled={end}>다음</Button>
      </div>
      
    </div>
  )
}

export default Books
