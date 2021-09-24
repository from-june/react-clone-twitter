import React from 'react';
import { NavLink } from 'react-router-dom';

import 'css/Navigation.css';
import mainLogo from 'images/twitter.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';

const Navigation = ({ signedInUser }) => {
  return (
    <div className="Navigation">
      <ul className="Navigation-box">
        <li className="Navigation-link">
          <NavLink to="/" exact activeClassName="active">
            <FontAwesomeIcon icon={faHome} size="lg" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/" exact>
            <div className="logo-box">
              <img
                className="logo"
                src={mainLogo}
                alt="Clone twitter"
                width="40px"
                height="40px"
              />
            </div>
          </NavLink>
        </li>
        <li className="Navigation-link">
          {signedInUser && (
            <NavLink to={`/${signedInUser.uid}`} activeClassName="active">
              <FontAwesomeIcon icon={faUser} size="lg" />
            </NavLink>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
