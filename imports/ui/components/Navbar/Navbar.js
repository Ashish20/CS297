import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { USER_TYPE } from '../../../constants';
import Search from '../../pages/Search/Search';
import './Navbar.scss';

const PublicNav = () => [
  <li key="login" className="nav-item">
    <NavLink to="/login">
      <button type="button" className="dropdown-item">
        Login
      </button>
    </NavLink>
  </li>,
  <li key="signup" className="nav-item">
    <NavLink to="/signup">
      <button type="button" className="dropdown-item">
        Signup
      </button>
    </NavLink>
  </li>,
];

const SearchBar = () => (
  <form className="form-inline my-2 my-lg-0">
    <input
      className="form-control mr-sm-2"
      type="search"
      placeholder="Search"
      aria-label="Search"
    />
    <button className="btn btn-outline-secondary my-2 my-sm-0" type="submit">
      <i className="fa fa-search" />
    </button>
  </form>
);
const renderNewNotificationCount = newNotificationsCount => {
  if (newNotificationsCount === 0 || !newNotificationsCount) {
    console.log('new Notification count = ', newNotificationsCount);
    return <></>;
  }
  return <span className="notif-count">{newNotificationsCount}</span>;
};

const LoggedInNav = props => (
  <>
    <li className="nav-item">
      <NavLink to="/newsfeed">
        <button type="button" className="dropdown-item">
          News Feed
        </button>
      </NavLink>
    </li>
    <li className="nav-item">
      <NavLink to="/explore">
        <button type="button" className="dropdown-item">
          Explore Issues
        </button>
      </NavLink>
    </li>
    {Meteor.user().userType === USER_TYPE.REPRESENTATIVE.id && (
      <li className="nav-item">
        <NavLink to="/Kanban">
          <button type="button" className="dropdown-item">
            Kanban Board
          </button>
        </NavLink>
      </li>
    )}
    {Meteor.user().userType === USER_TYPE.CITIZEN.id && (
      <li className="nav-item">
        <NavLink to="/assigned_issues">
          <button type="button" className="dropdown-item">
            Raise Issues
          </button>
        </NavLink>
      </li>
    )}
    <li className="nav-item">
      <NavLink to={`/notifications/${Date.now()}`}>
        <button type="button" className="dropdown-item">
          Notifications
          {renderNewNotificationCount(props.newNotificationsCount)}
        </button>
      </NavLink>
    </li>
    <li className="nav-item">
      <NavLink to="/profile">
        <button type="button" className="dropdown-item">
          Profile
        </button>
      </NavLink>
    </li>
    <li className="nav-item">
      <div className="dropdown-divider" />
    </li>
    <li className="nav-item">
      <NavLink to="/login" onClick={() => Meteor.logout()}>
        <button type="button" className="dropdown-item">
          Logout
        </button>
      </NavLink>
    </li>
    {/* <SearchBar key="searchbar" /> */}
    <Search {...props} />
  </>
);

const Status = ({ loggedIn }) => (
  <div className="my-2 mr-3">
    {loggedIn ? (
      <span className="text-success">
        <i className="fa fa-circle" />
      </span>
    ) : (
      <span className="text-secondary">
        <i className="fa fa-circle" />
      </span>
    )}
  </div>
);

Status.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

const Navbar = props => {
  const { loggedIn } = props;
  const { newNotificationsCount } = props;
  return (
    <nav className="navbar navbar-expand-lg">
      {/* <Status loggedIn={loggedIn} /> */}
      <span className="navbar-brand" href="#">
        <NavLink to="/">PoliTracker</NavLink>
      </span>
      {/* {loggedIn && <NavLink to="/assigned_issues/">Assigned Issues</NavLink>} */}
      {/* {loggedIn && <NavLink to="/newsfeed/">News Feed</NavLink>} */}
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          {loggedIn ? <LoggedInNav {...props} /> : <PublicNav />}
        </ul>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  newNotificationsCount: PropTypes.number.isRequired,
};

LoggedInNav.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  newNotificationsCount: PropTypes.number.isRequired,
};

export default withTracker(props => {
  // const subHandlers = [Meteor.subscribe('user')];
  const { loggedIn } = props;
  const newNotificationsCount = loggedIn && Meteor.user().newNotificationsCount;
  return { newNotificationsCount };
})(Navbar);
