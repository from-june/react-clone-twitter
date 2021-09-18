import React from 'react';
import { Link } from 'react-router-dom';

import 'css/Navigation.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';

const Navigation = ({ signedInUser }) => {
  return (
    <ul className="Navigation-box">
      <li className="Navigation-link">
        <Link to="/">
          <FontAwesomeIcon
            icon={faHome}
            size="2x"
            className="link-item"
            id="home-item"
          />{' '}
          <span className="link-item" id="home-item">
            홈
          </span>
        </Link>
      </li>
      <li className="Navigation-link">
        {signedInUser && (
          <Link to="/profile">
            <FontAwesomeIcon icon={faUser} size="2x" className="link-item" />{' '}
            <span className="link-item">프로필</span>
          </Link>
        )}
      </li>
    </ul>
  );
};

export default Navigation;
