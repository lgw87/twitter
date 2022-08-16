import { dbService } from "../fbase";
import React, { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import Tweet from "../components/Tweet";


const Home = ({userObj}) => {
    const [tweet , setTweet] = useState("");
    const [tweets , setTweets] = useState([]);
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
        await addDoc(collection(dbService , "tweets"),{
            text: tweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
        });
        setTweet("");
    }
    const onChange = (event) => {
        const {
            target:{value},
        } = event;
        setTweet(value);
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
            <input 
                type="submit" 
                value="Tweet"
            />
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