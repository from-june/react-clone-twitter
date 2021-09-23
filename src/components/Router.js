import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Navigation from 'components/Navigation';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';

const Router = ({ isSignedIn, signedInUser, refreshUser }) => {
  return (
    <>
      <HashRouter>
        <Switch>
          {isSignedIn ? (
            <>
              <Navigation signedInUser={signedInUser} />
              <Route exact path="/">
                <Home signedInUser={signedInUser} />
              </Route>
              <Route path="/:uid">
                <Profile
                  signedInUser={signedInUser}
                  refreshUser={refreshUser}
                />
              </Route>
            </>
          ) : (
            <Route exact path="/">
              <Auth />
            </Route>
          )}
        </Switch>
      </HashRouter>
    </>
  );
};

export default Router;
