/* eslint-disable react/jsx-wrap-multilines */
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Comment({ comment }) {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <NavLink to={`/profile/${comment.author.id}`}>
            <Avatar>{comment.author.name.substring(0, 1)}</Avatar>
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
