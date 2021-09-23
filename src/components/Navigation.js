import React from 'react';
import { NavLink } from 'react-router-dom';

import 'css/Navigation.css';
import mainLogo from 'images/twitter.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';

const Navigation = ({ signedInUser }) => {
  // const [activeLink, setActiveLink] = useState(null);

  /*const resetColor = () => {
    document
      .querySelectorAll('.link-item')
      .forEach(item => (item.style.color = '#999'));
  };

  const onTargetClick = event => {
    const parentEl = event.target.closest('.Navigation-link');

    if (parentEl.className === 'Navigation-link nav__home') {
      resetColor();
      document.querySelector('.link__home').style.color = '#1da1f2';
    }

    if (parentEl.className === 'Navigation-link nav__profile') {
      resetColor();
      document.querySelector('.link__profile').style.color = '#1da1f2';
    }
  };*/

  return (
    <div className="Navigation">
      <ul className="Navigation-box">
        <li className="Navigation-link nav__home">
          <NavLink to="/" exact>
            <FontAwesomeIcon
              icon={faHome}
              size="lg"
              className="link-item link__home"
            />
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
        <li className="Navigation-link nav__profile">
          {signedInUser && (
            <NavLink to={`/${signedInUser.uid}`} exact>
              <FontAwesomeIcon
                icon={faUser}
                size="lg"
                className="link-item link__profile"
              />
            </NavLink>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
