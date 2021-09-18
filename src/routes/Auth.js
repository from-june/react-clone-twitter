import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from '@firebase/auth';
import { authService } from 'myFirebase';
import AuthFromSocial from 'components/AuthFromSocial';

import 'css/Auth.css';
import mainLogo from 'images/twitter.png';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

  const onInputChange = event => {
    if (event.target.name === 'email') setEmail(event.target.value);
    if (event.target.name === 'password') setPassword(event.target.value);
  };

  const toggleAccount = () => setNewAccount(prev => !prev);

  const onSignInSubmit = async event => {
    event.preventDefault();
    setEmail('');
    setPassword('');

    try {
      if (newAccount)
        await createUserWithEmailAndPassword(authService, email, password);
      if (!newAccount)
        await signInWithEmailAndPassword(authService, email, password);
    } catch (error) {
      setError(error.message.slice(10));
    }
  };

  return (
    <div className="Auth">
      <div className="logo">
        <img src={mainLogo} alt="Clone Twitter" width="120px" height="120px" />
        <h1 className="Clone-Twitter">Clone Twitter</h1>
      </div>

      <form className="form" onSubmit={onSignInSubmit}>
        <div className="account-form">
          <label className="label" htmlFor="email">
            이메일
          </label>
          <input
            className="account-input"
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={onInputChange}
          />
        </div>
        <div className="account-form">
          <label className="label" htmlFor="password">
            비밀번호
          </label>
          <input
            className="account-input"
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onInputChange}
          />
        </div>
        <button className="btn btn-account" type="submit">
          {newAccount ? '회원가입' : '로그인'}
        </button>
      </form>
      <p className="error">{error}</p>
      <p className="account" onClick={toggleAccount}>
        {newAccount ? '로그인' : '회원가입'}
      </p>

      <AuthFromSocial />
    </div>
  );
};

export default Auth;
