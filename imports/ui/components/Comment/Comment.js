/* eslint-disable react/jsx-wrap-multilines */
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import React from 'react';

export default function Comment({ comment }) {
  return (
    <>
      <ListItem alignItems="flex-start">
        <Avatar>
          {Meteor.user() ? Meteor.user().name.substring(0, 1) : ''}
        </Avatar>
        <ListItemText
          primary={comment.author.name}
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
