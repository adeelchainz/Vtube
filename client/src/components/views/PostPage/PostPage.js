import React, {useEffect,useState} from 'react';
import {List, Typography, Avatar, Row, Col} from 'antd';
import Axios from 'axios';
import SideBar from './Sections/SideBar';

function PostPage(props) {

    const videoId=props.match.params.videoId

    const [Video, setVideo]= useState([])

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
    },[])
    return (
    <Row>
        <Col lg={18} xs={24}>
        <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
            <video style={{ width: '100%' }} src={`http://localhost:5000/${Video.filePath}`} controls></video>

            <List.Item
                actions={[]}
            >
                <List.Item.Meta
                    avatar={<Avatar src={Video.writer && Video.writer.image}/>}
                    title={<a href="https://ant.design">{Video.title}</a>}
                    description={Video.description}
                />
                <div></div>
            </List.Item>

        </div>
        </Col>

        <Col lg={6} xs={24}>
                <SideBar/>
        </Col>
    </Row>
    );
}

export default PostPage;