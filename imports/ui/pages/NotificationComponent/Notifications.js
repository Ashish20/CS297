import { Grid, List, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React from 'react';
import { useEffect, useState } from 'react';
import { resetNotificationCounter } from '../../../api/notification/methods';
import Notification from '../../../api/notification/notification';
import { GET_USER_NOTIFICATIONS } from '../../../api/notification/publications';
import Spinner from '../../components/Spinner';
import NotificationComponent from './NotificationComponent';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#f4f4f5',
  },
  inline: {
    display: 'inline',
    margin: '2px',
    // fontStyle: 'bold',
    // fontWeight: 'bold',
  },
  smallIconSeparator: {
    fontSize: '4px',
    margin: '4px',
  },
}));
// eslint-disable-next-line react/prefer-stateless-function
function Notifications({ propsReady, notifications, lastClicked }) {
  const classes = useStyles();
  const [lastReloaded, setLastReloaded] = useState('');

  const resetNewNotificationsCount = () => {
    resetNotificationCounter.call({ userId: Meteor.userId() });
  };

  useEffect(function() {
    if (Meteor.user() && Meteor.user().roles && lastReloaded !== lastClicked) {
      resetNewNotificationsCount();
      setLastReloaded(lastClicked);
    }
  });
  if (propsReady) {
    return (
      <Grid container spacing={1}>
        <Grid item xs={3} />

        <Grid item xs={6}>
          <List className={classes.root}>
            {notifications.map(notification => (
              <NotificationComponent
                key={notification._id}
                {...{ notification }}
              />
            ))}
          </List>
        </Grid>

        <Grid item xs={3} />
        {/* <Paper> </Paper> */}
        {/* </Grid> */}
      </Grid>
    );
  }
  return <Spinner />;
}
Notifications.propTypes = {
  propsReady: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  lastClicked: PropTypes.string.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default withTracker(props => {
  const { lastClicked } = props.match.params;
  const subHandles = [
    Meteor.subscribe('users.sameZip'),
    Meteor.subscribe('issues'),
    Meteor.subscribe('user'),
    Meteor.subscribe(GET_USER_NOTIFICATIONS, Meteor.userId(), lastClicked),
  ];
  const subsReady = subHandles.every(handle => handle.ready());

  let propsReady = false;
  let notifications = null;
  if (subsReady) {
    const notificationIds = Meteor.user().notifications || [];
    notifications = Notification.find(
      { _id: { $in: notificationIds } },
      { sort: { createdOn: -1 } }
    ).fetch();
    propsReady = notifications.every(notif => !!notif);
  }

  return {
    lastClicked,
    propsReady,
    notifications,
  };
})(Notifications);
