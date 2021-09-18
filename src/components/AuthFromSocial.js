import React from 'react';
import { authService } from 'myFirebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from '@firebase/auth';

import 'css/AuthFromSocial.css';
import Google from 'images/google.png';
import Github from 'images/github.png';

const AuthFromSocial = () => {
  const onSocialClick = async event => {
    let provider;

    try {
      if (event.target.name === 'google') provider = new GoogleAuthProvider();
      if (event.target.name === 'github') provider = new GithubAuthProvider();
      await signInWithPopup(authService, provider);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="social-account">
      <div className="social">
        <img
          onClick={onSocialClick}
          name="google"
          src={Google}
          alt="Google logo"
          aria-label="Continue with Google"
          width="40px"
          height="40px"
        />
      </div>
      <div className="social">
        <img
          name="github"
          onClick={onSocialClick}
          src={Github}
          alt="Github logo"
          aria-label="Continue with Github"
          width="40px"
          height="40px"
        />
      </div>
    </div>
  );
};

export default AuthFromSocial;
