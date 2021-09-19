import React, { useCallback, useEffect, useState } from 'react';
import { dbService } from 'myFirebase';
import {
  collection,
  getDocs,
  orderBy,
  query,
  where
} from '@firebase/firestore';

import 'css/MyTweet.css';

const MyTweet = ({ signedInUser }) => {
  const [myTweets, setMyTweets] = useState([]);

  const getMyTweets = useCallback(async () => {
    const tweets = query(
      collection(dbService, 'tweets'),
      where('creatorId', '==', signedInUser.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(tweets);
    const myTweetArr = querySnapshot.docs.map(doc => ({
      id: doc.data().createdAt,
      text: doc.data().text
    }));
    setMyTweets(myTweetArr);
  }, [signedInUser.uid]);

  useEffect(() => {
    getMyTweets();
  }, [getMyTweets]);
  return (
    <div className="MyTweet">
      {myTweets.map(tweet => (
        <div className="tweet-mine" key={tweet.id}>
          <p className="tweet-mine-text" key={tweet.id}>
            {tweet.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyTweet;
