/* eslint-disable react/jsx-wrap-multilines */
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Comment from './Comment';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Comments({ issue }) {
  const classes = useStyles();

  const { comments } = issue;
  return (
    <List className={classes.root}>
      {comments.map(comment => (
        <Comment comment={comment} />
      ))}
    </List>
  );
}
