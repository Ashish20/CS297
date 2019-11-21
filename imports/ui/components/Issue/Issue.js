/* eslint-disable react/jsx-wrap-multilines */
import { Collapse, Divider, Grid } from '@material-ui/core';
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
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import clsx from 'clsx';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  issueToggleUpVote,
  issueUpdateState,
} from '../../../api/issues/methods';
import UserFiles from '../../../api/UserFiles/userFiles';
import AddComment from '../Comment/AddComment';
import Comments from '../Comment/Comments';
// import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';
import StateIndicator from '../ProgressIndicator/StateIndicator';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
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
    transform: 'rotate(0deg)',
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

function Issue({
  imagePath,
  proPicPath,
  issueId,
  issue,
  onDragStop,
  // onChange,
}) {
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
          <Avatar className={classes.avatar}>
            {issue.ownerName ? issue.ownerName.substring(0, 1) : ''}
            {/* <img className="avatar" src={proPicPath} /> */}
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
        title={
          <Grid container spacing={2}>
            <Grid item>
              <NavLink to={`/profile/${issue.owner}`}>
                {issue.ownerName}
              </NavLink>
            </Grid>
            <Grid item>
              {/* <ArrowRightIcon fontSize="medium" /> */}
              <ArrowForwardIcon fontSize="medium" color="primary" />
            </Grid>
            <Grid item>
              <NavLink to={`/profile/${issue.assignedTo}`}>
                {issue.assigneeName || issue.assignedTo}
              </NavLink>
            </Grid>
          </Grid>
        }
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
      {issue.imageURL && (
        <CardMedia className={classes.media} image={imagePath} />
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
          {issue.comments ? (
            <Typography variant="body2">
              {`${issue.comments.length} comments`}
            </Typography>
          ) : (
            <Typography variant="body2">Add a comment</Typography>
          )}
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
  // }
}

// Tracker.autorun(() => {
//   Meteor.subscribe('user');
//   Meteor.subscribe('files.all');
//   Meteor.subscribe('issues.samezip')
// }
// );

export default withTracker(props => {
  const subscriberHandles = [
    Meteor.subscribe('user'),
    Meteor.subscribe('files.all'),
  ];
  const propsReady = subscriberHandles.every(handle => handle.ready());
  console.log('In Withtrackerrrrrrrrrrrrrrr');

  let image_Id = '';
  let issuedoc = '';
  let imagePath = '';
  let proPic_Id = '';
  let proPicDoc = '';
  let proPicPath = '';
  let issueId = props.issueId;
  let issue = props.issue;
  let onDragStop = props.onDragStop;
  // let onChange = props.onChange;

  if (propsReady) {
    // Issue Image
    image_Id = props.issue.imageURL;
    issuedoc = UserFiles.findOne({ _id: image_Id });
    imagePath = issuedoc && issuedoc.link();

    console.log(image_Id);
    console.log(issuedoc);
    console.log(imagePath);

    // User Image
    proPic_Id = Meteor.user().imageURL;
    proPicDoc = UserFiles.findOne({ _id: proPic_Id });
    proPicPath = proPicDoc && proPicDoc.link();

    console.log(proPic_Id);
    console.log(proPicDoc);
    console.log(proPicPath);
  }

  return {
    imagePath,
    proPicPath,
    issueId,
    issue,
    onDragStop,
    // onChange,
  };
})(Issue);
