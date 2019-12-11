import { Grid, Paper, Divider } from '@material-ui/core';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React from 'react';
import Issues from '../../../api/issues/issues';
import Issue from '../../components/Issue/Issue';
import { PostIssue } from '../../components/PostIssue';
// eslint-disable-next-line react/prefer-stateless-function
class NewsFeed extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.loggedIn) this.props.history.push('/login');
  }

  render() {
    const { feedIssues } = this.props;

    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={3} />

        <Grid item xs={12} md={6}>
          <div>
            <PostIssue />
          </div>
          <Divider />
          <React.Fragment>
            {feedIssues.map(issue => (
              // eslint-disable-next-line no-unused-expressions
              <Issue
                issueId={issue._id}
                issue={issue}
                key={issue._id}
                // onDragStop={this.onDragStop}
              />
            ))}
          </React.Fragment>
        </Grid>

        <Grid item xs={12} md={3} />
      </Grid>
    );
  }
}

NewsFeed.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  issuesReady: PropTypes.bool.isRequired,
  feedIssues: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default withTracker(() => {
  // remote example (if using ddp)
  /*
    const usersSub = Remote.subscribe('users.friends'); // publication needs to be set on remote server
    const users = Users.find().fetch();
    const usersReady = usersSub.ready() && !!users;
    */

  // issues example
  const issuesSub = Meteor.subscribe('issues.samezip');
  const feedIssues = Issues.find({}, { sort: { createdOn: -1 } }).fetch();
  feedIssues.sort(function(a, b) {
    return b.upVoters.length - a.upVoters.length;
  });

  console.log('FeedIssues', feedIssues);
  const issuesReady = issuesSub.ready() && !!feedIssues;

  return {
    // remote example (if using ddp)
    // usersReady,
    // users,

    issuesReady,
    feedIssues,
  };
})(NewsFeed);
