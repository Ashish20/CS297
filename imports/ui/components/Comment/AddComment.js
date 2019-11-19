import { Button } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { issueAddComment } from '../../../api/issues/methods';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%',
  },
  multiline: {
    padding: '10px',
    borderRadius: '20px',
  },
}));

export default function AddComment({ issue }) {
  const classes = useStyles();
  const [comment, setComment] = useState('');
  //   const formRef = useRef(null);
  const handleAddComment = e => {
    e.preventDefault();
    issueAddComment.call({ issueId: issue._id, comment });
    setComment('');
  };

  const handleKeyPress = e => {
    // if the user presses enter button
    if (e.charCode === 13 && !e.shiftKey) {
      e.preventDefault();
      handleAddComment(e);
    }
  };
  return (
    <form
      className={classes.container}
      noValidate
      autoComplete="off"
      onSubmit={handleAddComment}
      //   ref = {formRef}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={1}>
          <Avatar className={classes.avatar}>
            {Meteor.user() ? Meteor.user().name.substring(0, 1) : ''}
            {/* <img className="avatar" src={proPicPath} /> */}
          </Avatar>
        </Grid>
        <Grid item xs={8}>
          <TextField
            id="outlined-textarea"
            value={comment}
            required
            onChange={e => setComment(e.target.value)}
            onKeyPress={handleKeyPress}
            // label="Multiline Placeholder"
            placeholder="Comment on this issue"
            multiline
            className={classes.textField}
            margin="normal"
            variant="outlined"
            InputProps={{ className: classes.multiline }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
          >
            Comment
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
