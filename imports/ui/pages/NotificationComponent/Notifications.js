import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React from 'react';
import NotificationComponent from './NotificationComponent';

// eslint-disable-next-line react/prefer-stateless-function
class Notifications extends React.Component {
  render() {
    return <NotificationComponent {...this.props} />;
  }
}
Notifications.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  lastClicked: PropTypes.string.isRequired,
};

export default withTracker(props => {
  return { lastClicked: props.match.params.lastClicked };
})(Notifications);
