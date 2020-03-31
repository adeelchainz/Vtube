import React, { useState, useReducer } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

function SingleComment(props) {

    const user=useSelector(state=> state.user);

    const [CommetnValue,setCommentValue]= useState("")
    const [OpenReply, setOpenReply]= useState(false)

    const handleChange=(e)=>{
        setCommentValue(e.currentTarget.value)
    }

    const openReply=()=>{
        setOpenReply(!OpenReply)
    }

    const onSubmit=(e)=>{
        e.preventDefault();

        const variables={
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id,
            content: CommetnValue
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response=> {
            if(response.data.success){
                setCommentValue("")
                setOpenReply(!OpenReply)
                props.refreshFunction(response.data.result)
                //console.log(response.data.result)
            } else{
                alert('Unable to Comment')
            }
        })
    }

const actions = [
    <span onClick={openReply}  key="comment-basic-reply-to">Reply to </span>
]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={
                    <Avatar
                        src={props.comment.writer.image}
                        alt="image"
                    />
                }
                content={
                    <p>
                        {props.comment.content}
                    </p>
                }
            ></Comment>


         {OpenReply && 
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={handleChange}
                        value={CommetnValue}
                        placeholder="write some comments"
                    />
                    <br />
                    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</Button>
                </form>
            }

        </div>
    );
}

export default SingleComment;