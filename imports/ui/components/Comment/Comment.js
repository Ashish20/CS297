/* eslint-disable react/jsx-wrap-multilines */
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

function Comment({ comment, author, propsReady }) {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <NavLink to={`/profile/${comment.author.id}`}>
            <Avatar src={propsReady && author.cloudinaryURL}>
              {comment.author.name.substring(0, 1)}
            </Avatar>
          </NavLink>
        </ListItemAvatar>
        <ListItemText
          primary={
            <NavLink to={`/profile/${comment.author.id}`}>
              {comment.author.name}
            </NavLink>
          }
          secondary={
            <Typography variant="body2" color="textPrimary">
              {comment.content}
            </Typography>
          }
        />
      </ListItem>
    </>
  );
}

export default withTracker(props => {
  const subscriberHandles = [Meteor.subscribe('users.sameZip')];
  const { comment } = props;
  const author = Meteor.users.findOne(comment.author.id);
  const propsReady =
    subscriberHandles.every(handle => handle.ready()) && !!author;
  return {
    comment,
    author,
    propsReady,
  };
})(Comment);
