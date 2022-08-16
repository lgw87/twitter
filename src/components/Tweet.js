import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { dbService } from "../fbase";

const Tweet = ({tweetObj , isOwner} ) => {
    const [editing , setEditing] = useState(false);
    const [newTweet , setNewTweet] = useState(tweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("정말 삭제 하시겠습니까?");
        if(ok){
            await deleteDoc(doc(dbService, "tweets" , tweetObj.id));
        }
    }
    const onUpdateClick = async () => {
        setEditing((prev) => !prev);
    }
    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setNewTweet(value);
    }
    const onSubmit = async () => {
        await updateDoc(doc(dbService, "tweets", tweetObj.id), { text: newTweet });
        onUpdateClick();
    }
    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input 
                            onChange={onChange}
                            type="text" 
                            placeholder="수정할 내용을 입력하세요" 
                            vlaue={newTweet} 
                            required 
                        />
                    </form>
                    <button onClick={onUpdateClick}>Cancle</button>
                </>   
                ) : (
                <>
                    <h4>{tweetObj.text}</h4>
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Tweet</button>
                            <button onClick={onUpdateClick}>Edit Tweet</button> 
                        </>
                    )}
                </>
                )
            } 
        </div>
    )
} 
export default Tweet;