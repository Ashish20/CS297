/* eslint-disable react/jsx-wrap-multilines */
import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import TransitionsModal from '../../components/TransitionModal/TransitionModal';
import Issue from '../../components/Issue/Issue';

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
function NotificationComponent({ notification }) {
  const classes = useStyles();

  const [showModal, setShowModal] = useState(false);

  const commenter = notification.actor();
  const issue = notification.target();
  return (
    <>
      <ListItem
        key={notification._id}
        alignItems="flex-start"
        onClick={() => setShowModal(true)}
      >
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
                <NavLink to={`/profile/${notification.actor()._id}`}>
                  {commenter.name}
                </NavLink>
              </Typography>
              <FiberManualRecordIcon className={classes.smallIconSeparator} />
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
      <TransitionsModal
        open={showModal}
        handleClose={() => setShowModal(false)}
        render={() => <Issue {...{ issueId: issue._id, issue }} />}
      />
      <Divider variant="inset" component="li" />
    </>
  );
}

NotificationComponent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  // eslint-disable-next-line react/require-default-props
  notification: PropTypes.objectOf(PropTypes.any),
};

export default withTracker(props => {
  const { notification } = props;
  return {
    notification,
  };
})(NotificationComponent);
