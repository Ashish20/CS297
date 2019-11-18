/* eslint-disable react/jsx-wrap-multilines */
import { Collapse, Divider } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import { blue, red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import {
  issueToggleUpVote,
  issueUpdateState,
} from '../../../api/issues/methods';
import AddComment from '../Comment/AddComment';
import Comments from '../Comment/Comments';
// import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';
import StateIndicator from '../ProgressIndicator/StateIndicator';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    marginBottom: '10px',
    marginTop: '10px',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  upVoted: {
    color: blue[500],
  },
  action: {
    marginRight: '10px',
  },
}));

function onIssueStateChange({ event, issueId, newState }) {
  event.preventDefault();
  // try {
  issueUpdateState.call({ issueId, newState });
  // } catch (err) {
  //   alert(err);
  // }
}

export default function Issue({ issueId, issue, onChange, onDragStop }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const [isUpvoted, setIsUpvote] = React.useState(
    issue.upVoters && issue.upVoters.includes(Meteor.userId())
  );

  const upVotes = issue.upVoters ? issue.upVoters.length : 0;

  console.log('In Recipe', issueId);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleUpvote = event => {
    event.preventDefault();
    issueToggleUpVote.call({ issueId });
    setIsUpvote(!isUpvoted);
  };
  // const name = user.name.substring(0, 1);
  // console.log(typeof name);
  // console.log(name);
  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.action}
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {issue.ownerName ? issue.ownerName.substring(0, 1) : ''}
          </Avatar>
        }
        action={
          // <IconButton aria-label="settings">
          <StateIndicator
            issueId={issueId}
            userTypeId={Meteor.user().userType}
            issueStateId={issue.state}
            handleStateChange={onIssueStateChange}
          />
          // </IconButton>
        }
        title={issue.ownerName}
        subheader={new Date(issue.createdOn).toDateString()}
      />

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {issue.title}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography>{issue.description}</Typography>
      </CardContent>
      {issue.image && (
        <CardMedia
          className={classes.media}
          image="https://via.placeholder.com/150
"
          title="Paella dish"
        />
      )}
      <CardActions disableSpacing>
        {/* <DiscreteSlider
          issueId={issueId}
          onChange={onChange}
          onDragStop={onDragStop}
        /> */}
        <IconButton
          size="small"
          onClick={handleUpvote}
          className={clsx({ [classes.upVoted]: isUpvoted })}
        >
          <ArrowUpwardIcon />
          <Typography variant="body2">{upVotes}</Typography>
        </IconButton>

        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent style={{ padding: '0px' }}>
          <Divider />
          <Comments issue={issue} />
          <AddComment issue={issue} />
        </CardContent>
      </Collapse>
    </Card>
  );
}
