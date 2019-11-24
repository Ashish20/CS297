/* eslint-disable import/no-named-default, react/destructuring-assignment */

// import packages
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
// import navbar
import Navbar from '../components/Navbar';
// import Spinner
import Spinner from '../components/Spinner';
import AssignedIssues from '../pages/AssignedIssues';
import Kanban from '../pages/KanbanBoard';
import Login from '../pages/Login';
import NewsFeed from '../pages/NewsFeed';
import NotFound from '../pages/Not-Found';
import Profile from '../pages/Profile';
// import hoc to pass additional props to routes
import PropsRoute from '../pages/PropsRoute';
import RecoverPassword from '../pages/RecoverPassword';
import ResetPassword from '../pages/ResetPassword';
import Signup from '../pages/Signup';
import './App.scss';
import Notifications from '../pages/NotificationComponent/Notifications';

const App = props => (
  <Router>
    <div>
      <PropsRoute component={Navbar} {...props} />
      {props.loggingIn && <Spinner />}
      <div className="appBody">
        <Switch>
          <PropsRoute exact path="/" component={Login} {...props} />
          <PropsRoute path="/login" component={Login} {...props} />
          <PropsRoute path="/signup" component={Signup} {...props} />
          <PropsRoute exact path="/profile" component={Profile} {...props} />
          <PropsRoute
            exact
            path="/profile/:_id"
            component={Profile}
            {...props}
          />
          <PropsRoute
            path="/assigned_issues/"
            component={AssignedIssues}
            {...props}
          />
          <PropsRoute path="/newsfeed" component={NewsFeed} {...props} />
          <PropsRoute
            path="/recover-password"
            component={RecoverPassword}
            {...props}
          />
          <PropsRoute
            path="/reset-password/:token"
            component={ResetPassword}
            {...props}
          />
          <PropsRoute path="/Kanban" component={Kanban} {...props} />
          <PropsRoute
            path="/notifications/:lastClicked"
            component={Notifications}
            {...{ props }}
          />
          <PropsRoute component={NotFound} {...props} />
        </Switch>
      </div>
    </div>
  </Router>
);

App.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  userReady: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const userSub = Meteor.subscribe('user');
  const user = Meteor.user();
  const userReady = userSub.ready() && !!user;
  const loggingIn = Meteor.loggingIn();
  const loggedIn = !loggingIn && userReady;
  // console.log(assignedIssues);
  return {
    loggingIn,
    userReady,
    loggedIn,
  };
})(App);
