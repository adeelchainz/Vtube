import React, { useState } from "react";
import { Button, Input } from "antd";
import { useSelector } from "react-redux";
import Axios from "axios";
import SingleComment from "./SingleComment"
import ReplyComment from "./ReplyComment";

const { TextArea } = Input;

function Comments(props) {
    const user = useSelector(state => state.user);
    const [Comment, setComment] = useState("");

    const handleChange = e => {
        setComment(e.currentTarget.value);
    };

    const onSubmit = e => {
        e.preventDefault();

        const variables = {
            content: Comment,
            writer: user.userData._id,
            postId: props.postId
        };

        Axios.post("/api/comment/saveComment", variables).then(response => {
            if (response.data.success) {
                setComment("")
                props.refreshFunction(response.data.result)
                } else {
                alert("Unable to get video");
            }
        });
    };

    return (
        <div>
            <br />
            <p>replies</p>
            <hr />
            {/* list */}
            {console.log(props.CommentList)}

            {props.CommentList && props.CommentList.map((comment,index)=>(

                (!comment.responseTo &&
                    <React.Fragment>
                    <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                    <ReplyComment CommentList={props.CommentList} postId={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction}
                    />
                </React.Fragment>
                )
                
            ))}

            <form style={{ display: "flex" }} onSubmit>
                <TextArea
                    style={{ width: "100%", borderRadius: "5px" }}
                    onChange={handleChange}
                    value={Comment}
                    placeholder="Comment it"
                />
                <br />
                <Button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    );
}

export default Comments;
