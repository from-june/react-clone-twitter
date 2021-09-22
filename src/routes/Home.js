import React, { useState, useEffect } from 'react';
import { dbService } from 'myFirebase';
import { collection, query, onSnapshot, orderBy } from '@firebase/firestore';
import CreateTweet from 'components/CreateTweet';
import Tweet from 'components/Tweet';

import 'css/Home.css';

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
    <div className="Home">
      <CreateTweet signedInUser={signedInUser} />
      <div className="TweetList">
        {tweetList.map(tweet => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === signedInUser.uid}
            likedUser={tweet.likeUsers?.includes(signedInUser.uid)}
            userId={signedInUser.uid}
          />
        ))}
      </div>
      <footer className="footer">
        <p>&copy; 2021 CloneTwitter</p>
        <div className="icon__link">
          Icons made by{' '}
          <a
            className="footer--link"
            href="https://www.freepik.com"
            title="Freepik"
            target="_blank"
            rel="noreferrer"
          >
            Freepik{' '}
          </a>
          from{' '}
          <a
            className="footer--link"
            href="https://www.flaticon.com/"
            title="Flaticon"
            target="_blank"
            rel="noreferrer"
          >
            www.flaticon.com
          </a>
          <p>
            and{' '}
            <a
              className="footer--link"
              href="https://fontawesome.com/"
              title="Font Awesome"
              target="_blank"
              rel="noreferrer"
            >
              Font Awesome
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
