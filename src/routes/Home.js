import { dbService , storageService } from "../fbase";
import React, { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { ref , uploadString , getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import Tweet from "../components/Tweet";



const Home = ({userObj}) => {
    const [tweet , setTweet] = useState("");
    const [tweets , setTweets] = useState([]);
    const [file , setFile] = useState("");
    useEffect(() => {
        onSnapshot(collection(dbService, "tweets"), (snapshot) => {
            const tweetArray = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data(), 
            }))
            setTweets(tweetArray);
        });
    } , []);
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
    <div>
        <form onSubmit={onSubmit}>
            <input 
                value={tweet}
                onChange={onChange}
                type="text" 
                placeholder="What's on your mind" 
                maxLength={120}
            />
            <input type="file" accecpt="image/*" onChange={onFileChange}/>
            <input type="submit" value="Tweet" />
            {file &&(
                <div>
                    <img src={file} width="50px" height="50px" />
                    <button onClick={onClearFileClick}>Clear</button>
                </div>)}
        </form>
        <div>
            {tweets.map((tweet) => (
                <Tweet key={tweet.id} tweetObj={tweet} isOwner={userObj.uid === tweet.creatorId ? true : false} />
            ))}
        </div>
    </div>
    )
}
export default Home;