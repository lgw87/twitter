import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { ref , uploadString , getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TweetFactory = ({userObj }) => {

    const [tweet , setTweet] = useState("");
    const [file , setFile] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        let fileUrl = "";
        if(file !== ""){
        const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
        await uploadString(fileRef , file , "data_url");
        fileUrl = await getDownloadURL(ref(storageService , fileRef ));
        }
        const tweetObj = {
            text: tweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
            fileUrl,
        }
        await addDoc(collection(dbService , "tweets"), tweetObj);
        setTweet("");
        setFile("");
    }
    const onChange = (event) => {
        const {
            target:{value},
        } = event;
        setTweet(value);
    }
    const onFileChange = (event) => {
        const {target : {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},
            } = finishedEvent
            setFile(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearFileClick = () => {
        setFile("");
    }
       
    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                className="factoryInput__input"
                value={tweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span><FontAwesomeIcon icon={faPlus} />
            </label>
        <input 
            id="attach-file"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{
              opacity: 0,
            }}
        />
        {file &&(
            <div className="factoryForm__attachment">
                <img
                    src={file}
                    style={{
                    backgroundImage: file,
                    }}
                />
                <div className="factoryForm__clear" onClick={onClearFileClick}>
                    <span>Remove</span><FontAwesomeIcon icon={faTimes} />
                </div>
            </div>)}
        </form>
    )
}

export default TweetFactory;