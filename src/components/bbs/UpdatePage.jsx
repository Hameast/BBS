import React, { useEffect, useState } from 'react'
import {app} from '../../firebaseInit'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { getFirestore, getDoc, doc, updateDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import moment from 'moment'

const UpdatePage = () => {
    const db=getFirestore(app);
    const {id}=useParams();
    const [form, setForm] = useState({
        title:'',
        contents:'',
        date:'',
        email:''
    });
    const {title, contents} = form;

    const callAPI = async() =>{
        const res = await getDoc(doc(db, `/posts/${id}`));
        console.log(res.data());
        setForm(res.data());
    }

    useEffect(()=>{
        callAPI();
    }, []);

    const onChangeForm = (e) =>{
        setForm({...form, [e.target.name]:e.target.value});
    }

    const onClickUpdate = async() =>{
        if(title==="" || contents===""){
            alert("제목과 내용을 입력하세요!!");
            return;
        }

        if(!window.confirm(`${id} 게시글을 수정하시겠습니까?`)) return;
        // 게시글 수정
        // const data={
        //     email: sessionStorage.getItem('email'),
        //     title,
        //     contents,
        //     date:moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')
        // }
        // console.log(data)

        await updateDoc(doc(db, `/posts/${id}`), form);
        alert('게시글 수정완료!');
        window.location.href=`/bbs/read/${id}`;
    }

  return (
    <Row className='my5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <h1 className='text-center'>글쓰기</h1>
                <div className='mt-5'>
                    <Form.Control 
                    name='title'
                    value={title}
                    placeholder='제목을 입력하세요' 
                    className='mb-2'
                    onChange={onChangeForm}></Form.Control>

                    <Form.Control 
                    name='contents'
                    value={contents}
                    placeholder='내용을 입력하세요' 
                    as="textarea" 
                    rows={10}
                    onChange={onChangeForm}></Form.Control>
                
                    <div className='text-center mt-3'>
                        <Button className='px-5 me-2' onClick={onClickUpdate}>수정</Button>
                        <Button className='px-5' variant='secondary'>취소</Button>
                    </div>
                </div>
            </Col>
        </Row>
  )
}

export default UpdatePage
