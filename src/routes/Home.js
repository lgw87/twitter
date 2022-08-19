import { dbService } from "../fbase";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import Tweet from "../components/Tweet";
import TweetFactory from "../components/TweetFactory";



const Home = ({userObj}) => {

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

    return (
    <div className="container">
        <TweetFactory userObj={userObj}/>
        <div style={{ marginTop: 30 }}>
            {tweets.map((tweet) => (
                <Tweet key={tweet.id} tweetObj={tweet} isOwner={userObj.uid === tweet.creatorId ? true : false} />
            ))}
        </div>
    </div>
    )
}
export default Home;