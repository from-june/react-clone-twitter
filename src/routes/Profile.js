import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router';
import { authService, dbService } from 'myFirebase';
import { signOut } from '@firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where
} from '@firebase/firestore';
import EditProfile from 'components/EditProfile';
import Tweet from 'components/Tweet';

import 'css/Home.css';
import 'css/Profile.css';

const Profile = ({ signedInUser, refreshUser }) => {
  const [bioText, setBioText] = useState('');
  const [myTweets, setMyTweets] = useState([]);

  const history = useHistory();
  const onLogoutClick = () => {
    signOut(authService);
    history.push('/');
  };

  const getMyTweets = useCallback(async () => {
    const tweets = query(
      collection(dbService, 'tweets'),
      where('creatorId', '==', signedInUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(tweets, snapshot => {
      const myTweetArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyTweets(myTweetArr);
    });

    return () => unsubscribe();
  }, [signedInUser.uid]);

  const getMyBio = useCallback(() => {
    const userBio = onSnapshot(doc(dbService, 'bio', signedInUser.uid), doc => {
      if (!doc.data()) return;
      setBioText(doc.data().text);
    });
    return () => userBio();
  }, [signedInUser.uid]);

  useEffect(() => {
    getMyBio();
    getMyTweets();
  }, [getMyTweets, getMyBio]);

  return (
    <div className="Profile Clone-container">
      <div className="Profile-userContent">
        <img
          className="Profile-userImg"
          src={signedInUser.photoURL}
          alt={signedInUser.displayName}
        />
        <div className="Profile-userText">
          <p className="Profile-userName">{signedInUser.displayName}</p>
          <p className="Profile-userBio">{bioText}</p>
        </div>
      </div>
      <EditProfile
        signedInUser={signedInUser}
        refreshUser={refreshUser}
        bioText={bioText}
      />

      <div className="TweetList">
        {myTweets.map(tweet => (
          <Tweet
            key={`${tweet.creatorId}/${tweet.createdAt}`}
            tweetObj={tweet}
            isOwner={tweet.creatorId === signedInUser.uid}
          />
        ))}
      </div>

      <button
        className="btn-control btn-signOut"
        type="submit"
        onClick={onLogoutClick}
      >
        로그아웃
      </button>
    </div>
  );
};

export default Profile;
