import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router';
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
  const { uid } = useParams();
  const [userImg, setUserImg] = useState(null);
  const [userName, setUserName] = useState('');

  const history = useHistory();
  const onLogoutClick = () => {
    signOut(authService);
    history.push('/');
  };

  useEffect(() => {
    const userBioText = onSnapshot(doc(dbService, 'bio', uid), doc =>
      setBioText(doc.data()?.text)
    );

    const tweets = query(
      collection(dbService, 'tweets'),
      where('creatorId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeTweet = onSnapshot(tweets, snapshot => {
      const TweetArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyTweets(TweetArr);
      setUserName(TweetArr[0]?.creatorName);
      setUserImg(TweetArr[0]?.creatorImg);
    });

    return () => {
      userBioText();
      unsubscribeTweet();
    };
  }, [uid]);

  return (
    <div className="Profile">
      <div className="Profile-userContent">
        <img
          className="Profile-userImg"
          src={userImg ? userImg : signedInUser.photoURL}
          alt={userName ? userName : signedInUser.displayName}
        />
        <div className="Profile-userText">
          <p className="Profile-userName">
            {userName ? userName : signedInUser.displayName}
          </p>
          <p className="Profile-userBio">{bioText}</p>
        </div>
        {uid === signedInUser.uid && (
          <button
            className="btn-control btn-signOut"
            type="submit"
            onClick={onLogoutClick}
          >
            로그아웃
          </button>
        )}
      </div>
      {uid === signedInUser.uid && (
        <EditProfile
          signedInUser={signedInUser}
          refreshUser={refreshUser}
          bioText={bioText}
          myTweets={myTweets}
        />
      )}

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
    </div>
  );
};

export default Profile;
