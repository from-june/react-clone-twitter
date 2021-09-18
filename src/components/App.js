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
          displayName: authService.currentUser.displayName
            ? authService.currentUser.displayName
            : 'Anonymous',
          uid: authService.currentUser.uid,
          photoURL: authService.currentUser.photoURL
        });
      } else {
        setIsSignedIn(false);
        setSignedInUser(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    setSignedInUser({
      displayName: authService.currentUser.displayName,
      uid: authService.currentUser.uid,
      photoURL: authService.currentUser.photoURL
    });
  };

  return (
    <div className="App">
      {init ? (
        <Router
          isSignedIn={isSignedIn}
          signedInUser={signedInUser}
          refreshUser={refreshUser}
        />
      ) : (
        <div className="init">
          <img src={mainLogo} alt="logo" width="50px" height="50px" />
          <p className="init-text">Initailizing...</p>
        </div>
      )}

      <footer className="footer">
        <p>&copy; 2021 CloneTwitter</p>
        <div>
          Icons made by{' '}
          <a
            href="https://www.freepik.com"
            title="Freepik"
            target="_blank"
            rel="noreferrer"
          >
            Freepik{' '}
          </a>
          from{' '}
          <a
            href="https://www.flaticon.com/"
            title="Flaticon"
            target="_blank"
            rel="noreferrer"
          >
            www.flaticon.com
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
