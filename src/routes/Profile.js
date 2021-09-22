import React, { useState, useEffect } from 'react';
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
  const [myTweets, setMyTweets] = useState([]);
  const [bioText, setBioText] = useState('');

  const history = useHistory();
  const onLogoutClick = () => {
    signOut(authService);
    history.push('/');
  };

  useEffect(() => {
    /* const bioRef = doc(dbService, 'bio', signedInUser.uid);
    const bioSnap = await getDoc(bioRef);
    if (bioSnap.exists()) setBioText(bioSnap.data().text); */

    const userBioText = onSnapshot(
      doc(dbService, 'bio', signedInUser?.uid),
      doc => setBioText(doc.data().text)
    );

    const tweets = query(
      collection(dbService, 'tweets'),
      where('creatorId', '==', signedInUser?.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeTweet = onSnapshot(tweets, snapshot => {
      const myTweetArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyTweets(myTweetArr);
    });

    return () => {
      userBioText();
      unsubscribeTweet();
    };
  }, [signedInUser?.uid]);

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
            likedUser={tweet.likeUsers?.includes(signedInUser.uid)}
            userId={signedInUser.uid}
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
