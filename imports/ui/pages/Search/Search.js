import React, { Component } from 'react';
import PropTypes from 'prop-types';
import algoliasearch from 'algoliasearch';
import {
  InstantSearch,
  Configure,
  Hits,
  Highlight,
  connectSearchBox,
} from 'react-instantsearch-dom';
import Autocomplete from './AutoComplete';
import './Search.css';
import { USER_TYPE } from '../../../constants';
import { withTracker } from 'meteor/react-meteor-data';
import Spinner from '../../components/Spinner';
import { NavLink } from 'react-router-dom';

const VirtalSearchBox = connectSearchBox(() => null);

const applicationId = 'MONNJNMDPQ';
const apiKey = '2f5014a87ede4bf7488002662c92f22f';
const client = algoliasearch(applicationId, apiKey);

const index = client.initIndex('rep-profiles');

class Search extends Component {
  state = {
    query: '',
    repId: '',
  };

  onSuggestionSelected = (_, { suggestion }) => {
    this.setState({
      query: suggestion.name,
      repId: suggestion.objectID,
    });
  };

  onSuggestionCleared = () => {
    this.setState({
      query: '',
      repId: '',
    });
  };

  render() {
    const { query, repId } = this.state;
    const { propsReady, reps } = this.props;

    if (propsReady) {
      console.log('Reps ' + reps);
      const fetchDataFromDatabase = () => {
        const actors = reps.map(rep => {
          return {
            objectID: rep._id,
            name: rep.name,
            designation: rep.designation,
          };
        });
        return actors;
      };

      const records = fetchDataFromDatabase();
      index.addObjects(records);
    }

    console.log('Selected issue ' + query + repId);
    return !propsReady ? (
      <Spinner />
    ) : (
      <div className="container">
        <InstantSearch indexName="rep-profiles" searchClient={client}>
          <Configure hitsPerPage={5} />
          <Autocomplete
            onSuggestionSelected={this.onSuggestionSelected}
            onSuggestionCleared={this.onSuggestionCleared}
          />
        </InstantSearch>
        <InstantSearch indexName="rep-profiles" searchClient={client}>
          <VirtalSearchBox defaultRefinement={query} />
          {/* <Hits hitComponent={Hit} /> */}
        </InstantSearch>
      </div>
    );
  }
}

function Hit(props) {
  return (
    <div>
      <Highlight attribute="name" hit={props.hit} />
    </div>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscriberHandles = [Meteor.subscribe('users.reps')];
  const propsReady = subscriberHandles.every(handle => handle.ready());

  console.log('Props ready for Search', propsReady);
  let reps = null;
  if (propsReady) {
    reps = Meteor.users.find({ userType: USER_TYPE.REPRESENTATIVE.id }).fetch();
    console.log('Reps from fetch ', reps);
  }

  return {
    // remote example (if using ddp)
    // usersReady,
    // users,
    propsReady,
    reps,
  };
})(Search);
