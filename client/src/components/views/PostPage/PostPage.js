import React, {useEffect,useState} from 'react';
import {List, Typography, Avatar, Row, Col} from 'antd';
import Axios from 'axios';
import SideBar from './Sections/SideBar';
import Subscriber from './Sections/Subscriber';
import Comments from './Sections/Comments';

function PostPage(props) {

    const videoId=props.match.params.videoId

    const [Video, setVideo]= useState([])
    const [CommentList, setCommentList]= useState([])

    const videoVariable= {
        videoId: videoId
    }

    useEffect(()=>{
        Axios.post('/api/video/getVideo', videoVariable)
        .then(response=>{
            if(response.data.success){
                setVideo(response.data.video)
                //console.log(response.data)
            }else {
                alert('Unable to get video')
            }
        })

        Axios.post('/api/comment/getComments', videoVariable)
        .then(response=>{
            if(response.data.success){
                setCommentList(response.data.comments)
                //console.log(response.data)
            }else {
                alert('Unable to get video')
            }
        })

    },[])

    const updateComment=(newComment)=>{
        setCommentList(CommentList.concat(newComment))
    }

    if(Video.writer){
        return (
            <Row>
                <Col lg={18} xs={24}>
                <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                    <video style={{ width: '100%' }} src={`http://localhost:5000/${Video.filePath}`} controls></video>
        
                    <List.Item
                        actions={[<Subscriber userTo={Video.writer._id} userFrom={localStorage.getItem('userId')} />]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={Video.writer && Video.writer.image}/>}
                            title={<a href="https://ant.design">{Video.title}</a>}
                            description={Video.description}
                        />
                        <div></div>
                    </List.Item>

                    <Comments CommentList={CommentList} postId={Video._id} refreshFunction={updateComment} />
        
                </div>
                </Col>
        
                <Col lg={6} xs={24}>
                        <SideBar/>
                </Col>
            </Row>
            );
    } else {
        return(
            <div>Fetching...</div>
        )
    }
    
}

export default PostPage;