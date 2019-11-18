import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CreateIcon from '@material-ui/icons/Create';
import React, { useState } from 'react';
import { issueAddComment } from '../../../api/issues/methods';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  margin: {
    margin: theme.spacing(1),
  },
  multiline: {
    padding: '10px',
    borderRadius: '20%',
  },
}));

export default function AddComment({ issue }) {
  const classes = useStyles();
  const [comment, setComment] = useState('');
  const handleAddComment = e => {
    e.preventDefault();
    issueAddComment.call({ issueId: issue._id, comment });
  };
  return (
    <form
      className={classes.container}
      noValidate
      autoComplete="off"
      onSubmit={handleAddComment}
    >
      <div className={classes.margin}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Avatar alt="Remy Sharp" src="https://via.placeholder.com/600" />
          </Grid>
          <Grid item>
            <TextField
              id="outlined-textarea"
              value={comment}
              onChange={e => setComment(e.target.value)}
              // label="Multiline Placeholder"
              placeholder="Comment on this issue"
              multiline
              className={classes.textField}
              margin="normal"
              variant="outlined"
              InputProps={{ className: classes.multiline }}
            />
          </Grid>
          <Grid item>
            <IconButton type="submit">
              <CreateIcon />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    </form>
  );
}
