import React, { useEffect, useState } from 'react';
import Router from 'components/Router';
import { onAuthStateChanged } from 'firebase/auth';
import { authService } from 'myFirebase';

import 'css/App.css';
import mainLogo from 'images/twitter.png';

const App = () => {
  const [init, setInit] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signedInUser, setSignedInUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authService, user => {
      if (user) {
        setIsSignedIn(true);
        setSignedInUser({
          displayName: user.displayName
            ? user.displayName
            : user.uid.slice(0, 9),
          uid: user.uid,
          photoURL: user.photoURL ? user.photoURL : mainLogo
        });
      } else {
        setIsSignedIn(false);
        setSignedInUser(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;

    setSignedInUser({
      displayName: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL ? user.photoURL : mainLogo
    });
  };

  return (
    <div className="App">
      {init ? (
        <div className="Main">
          <Router
            isSignedIn={isSignedIn}
            signedInUser={signedInUser}
            refreshUser={refreshUser}
          />
        </div>
      ) : (
        <div className="init">
          <img src={mainLogo} alt="logo" width="50px" height="50px" />
          <p className="init-text">Initailizing...</p>
        </div>
      )}
    </div>
  );
};

export default App;
