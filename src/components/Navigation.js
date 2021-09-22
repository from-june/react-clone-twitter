import React from 'react';
import { Link } from 'react-router-dom';

import 'css/Navigation.css';
import mainLogo from 'images/twitter.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';

const Navigation = ({ signedInUser }) => {
  const resetColor = () => {
    document
      .querySelectorAll('.link-item')
      .forEach(item => (item.style.color = '#999'));
  };

  const onTargetClick = event => {
    const parentEl = event.target.closest('.Navigation-link');
    if (parentEl.id === 'link-home') {
      resetColor();
      document
        .querySelectorAll('#home-item')
        .forEach(item => (item.style.color = '#1da1f2'));
    }
    if (parentEl.id === 'link-profile') {
      resetColor();
      document
        .querySelectorAll('#profile-item')
        .forEach(item => (item.style.color = '#1da1f2'));
    }
  };

  return (
    <div className="Navigation">
      <ul className="Navigation-box">
        <li className="Navigation-link" id="link-home" onClick={onTargetClick}>
          <Link to="/">
            <FontAwesomeIcon
              icon={faHome}
              size="lg"
              className="link-item"
              id="home-item"
            />
          </Link>
        </li>
        <li>
          <Link to="/">
            <div className="logo-box">
              <img
                className="logo"
                src={mainLogo}
                alt="Clone twitter"
                width="40px"
                height="40px"
              />
            </div>
          </Link>
        </li>
        <li
          className="Navigation-link"
          id="link-profile"
          onClick={onTargetClick}
        >
          {signedInUser && (
            <Link to="/profile">
              <FontAwesomeIcon
                icon={faUser}
                size="lg"
                className="link-item"
                id="profile-item"
              />
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
