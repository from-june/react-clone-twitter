import React, { useState, useEffect } from 'react';
import { dbService } from 'myFirebase';
import { collection, query, onSnapshot, orderBy } from '@firebase/firestore';
import CreateTweet from 'components/CreateTweet';
import Tweet from 'components/Tweet';

import 'css/Home.css';
import mainLogo from 'images/twitter.png';

const Home = ({ signedInUser }) => {
  const [tweetList, setTweetList] = useState([]);

  useEffect(() => {
    const tweets = query(
      collection(dbService, 'tweets'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(tweets, snapshot => {
      const tweetArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTweetList(tweetArr);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="Clone-container Home">
      <div className="logo-box">
        <img
          className="logo"
          src={mainLogo}
          alt="Clone twitter"
          width="40px"
          height="40px"
        />
      </div>
      <CreateTweet signedInUser={signedInUser} />
      <div className="TweetList">
        {tweetList.map(tweet => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === signedInUser.uid}
            signedInUser={signedInUser}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
