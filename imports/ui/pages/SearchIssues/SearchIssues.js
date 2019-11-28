import algoliasearch from 'algoliasearch';
import React, { Component } from 'react';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Highlight,
  ClearRefinements,
  Configure,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './SearchIssues.css';
import Issue from '../../components/Issue/Issue';
import { withTracker } from 'meteor/react-meteor-data';
import Issues from '../../../api/issues/issues';
import UserFiles from '../../../api/UserFiles/userFiles';
import { makeStyles } from '@material-ui/core/styles';

const searchClient = algoliasearch(
  'MONNJNMDPQ',
  '2f5014a87ede4bf7488002662c92f22f'
);

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 200,
    marginBottom: '10px',
    marginTop: '10px',

    // backgrounColor: '#e8eaf6',
  },
  media: {
    height: 0,
    paddingTop: '80%',
  },

  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    alignItems: 'center',
    justifyContents: 'center',
  },
}));

class SearchIssues extends Component {
  render() {
    return (
      <div className="ais-InstantSearch">
        <InstantSearch indexName="issues" searchClient={searchClient}>
          <div className="right-panel">
            <SearchBox />
            <Hits hitComponent={Hit} />
          </div>
        </InstantSearch>
      </div>
    );
  }
}

// function Hit(props) {
//   console.log('inside hit');
//   console.log(props);
//   const issueId = props.hit.objectID;
//   const issue = Issues.findOne(issueId);
//   return (
//     <div>
//       <div className="hit-name">
//         <Highlight attribute="title" hit={props.hit} />
//       </div>
//       <Issue issueId={issueId} issue={issue} />
//     </div>
//   );
// }
function Hit(props) {
  const classes = useStyles();
  const issue = Issues.findOne(props.hit.objectID);
  const imageId = issue && issue.imageURL;
  const issuedoc = UserFiles.findOne({ _id: imageId });
  const imagePath = issuedoc && issuedoc.link();

  return (
    <Card className={classes.card}>
      <CardContent>
        <CardMedia
          className={classes.media}
          image={imagePath}
          title="Profile picture"
        />
        <div className="hit-name">
          <Highlight attribute="title" hit={props.hit} />
        </div>
        <div className="hit-description">
          <Highlight attribute="isssueDesc" hit={props.hit} />
        </div>
      </CardContent>
    </Card>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

// export default SearchIssues;

export default withTracker(() => {
  const issuesSub = Meteor.subscribe('issues');
  const issuesReady = issuesSub.ready();

  return {
    issuesReady,
  };
})(SearchIssues);
