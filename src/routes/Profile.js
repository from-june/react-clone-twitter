import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { authService, dbService } from 'myFirebase';
import { signOut } from '@firebase/auth';
import { doc, onSnapshot } from '@firebase/firestore';
import EditProfile from 'components/EditProfile';
import MyTweet from 'components/MyTweet';

import 'css/Profile.css';

const Profile = ({ signedInUser, refreshUser }) => {
  const [bioText, setBioText] = useState('');

  const history = useHistory();
  const onLogoutClick = () => {
    signOut(authService);
    history.push('/');
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbService, 'bio', signedInUser.uid),
      doc => {
        if (!doc.data()) return;
        setBioText(doc.data().text);
      }
    );
    return () => unsubscribe();
  }, [signedInUser.uid]);

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
      <EditProfile signedInUser={signedInUser} refreshUser={refreshUser} />
      <MyTweet signedInUser={signedInUser} />
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
