/* eslint-disable react/jsx-wrap-multilines */
import {
  Avatar,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Notification from '../../../api/notification/notification';
import { GET_USER_NOTIFICATIONS } from '../../../api/notification/publications';
import { resetNotificationCounter } from '../../../api/notification/methods';
import Spinner from '../../components/Spinner';

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
function NotificationComponent({
  // subsReady,
  notificationIds,
  propsReady,
  notifications,
  lastClicked,
}) {
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

  if (propsReady && notificationIds) {
    return (
      <Grid container spacing={1}>
        <Grid item xs={3} />

        <Grid item xs={8}>
          <List className={classes.root}>
            {notifications.map(notification => {
              // const notification = Notification.findOne(notId);
              // eslint-disable-next-line no-unused-expressions

              const commenter = notification.actor();
              const issue = notification.target();
              return (
                <>
                  <ListItem key={notification._id} alignItems="flex-start">
                    <ListItemAvatar>
                      <NavLink to={`/profile/${notification.actor()._id}`}>
                        <Avatar>{commenter.name.substring(0, 1)}</Avatar>
                      </NavLink>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            // component="span"
                            variant="body1"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            <NavLink
                              to={`/profile/${notification.actor()._id}`}
                            >
                              {commenter.name}
                            </NavLink>
                          </Typography>
                          <FiberManualRecordIcon
                            className={classes.smallIconSeparator}
                          />
                          <Typography
                            className={classes.inline}
                            variant="body2"
                            color="textSecondary"
                          >
                            {new Date(notification.createdOn).toDateString()}
                          </Typography>
                          <Typography
                            // className={classes.inline}
                            variant="body2"
                            color="textSecondary"
                          >
                            {`commented on '${issue.title}'`}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {`${notification.comment.content}`}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              );
            })}
          </List>
        </Grid>

        <Grid item xs={3}>
          <Paper> Placeholder for some other content</Paper>
        </Grid>
      </Grid>
    );
  }
  return <Spinner />;
}

NotificationComponent.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  propsReady: PropTypes.bool.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.any).isRequired,
  notificationIds: PropTypes.arrayOf(PropTypes.String).isRequired,
  lastClicked: PropTypes.bool.isRequired,
};

export default withTracker(props => {
  const { lastClicked } = props;
  const subHandles = [
    Meteor.subscribe('users.sameZip'),
    Meteor.subscribe('issues'),
    Meteor.subscribe('user'),
    Meteor.subscribe(GET_USER_NOTIFICATIONS, Meteor.userId(), lastClicked),
    // Meteor.subscribe('user'),
  ];
  const subsReady = subHandles.every(handle => handle.ready());

  let propsReady = false;
  let notificationIds = null;
  let notifications = null;
  let newNotificationsCount = 0;
  if (subsReady) {
    notificationIds = Meteor.user().notifications || [];
    notifications = Notification.find(
      { _id: { $in: notificationIds } },
      { sort: { createdOn: -1 } }
    ).fetch();
    newNotificationsCount = Meteor.user().newNotificationsCount;
    propsReady = notifications.every(notif => !!notif);
    // if (propsReady) console.log(notifications);
  }

  return {
    // remote example (if using ddp)
    // usersReady,
    // users,
    // subsReady,
    propsReady,
    notificationIds,
    notifications,
    newNotificationsCount,
    lastClicked,
  };
})(NotificationComponent);
