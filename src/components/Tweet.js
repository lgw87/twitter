import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { dbService , storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Tweet = ({tweetObj , isOwner} ) => {
    const [editing , setEditing] = useState(false);
    const [newTweet , setNewTweet] = useState(tweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("정말 삭제 하시겠습니까?");
        if(ok){
            await deleteDoc(doc(dbService, "tweets" , tweetObj.id));
            if(tweetObj.fileUrl !== ""){
                await deleteObject(ref(storageService, tweetObj.fileUrl)); 
            }
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
        <div className="nweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit}  className="container nweetEdit">
                        <input 
                            onChange={onChange}
                            type="text" 
                            placeholder="수정할 내용을 입력하세요" 
                            vlaue={newTweet} 
                            required 
                            autoFocus
                            className="formInput"
                        />
                         <input type="submit" value="Update Nweet" className="formBtn" />
                    </form>
                    <button onClick={onUpdateClick} className="formBtn cancelBtn">Cancle</button>
                </>   
                ) : (
                <>
                    <h4>{tweetObj.text}</h4>
                    {tweetObj.fileUrl && <img src={tweetObj.fileUrl} />}
                    {isOwner && (
                         <div className="nweet__actions">
                            <span onClick={onDeleteClick}><FontAwesomeIcon icon={faTrash} /></span>
                            <span onClick={onUpdateClick}><FontAwesomeIcon icon={faPencilAlt} /></span>
                         </div>
                    )}
                </>
                )
            } 
        </div>
    )
} 
export default Tweet;