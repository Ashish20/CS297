import React, { Component } from 'react';
import PropTypes from 'prop-types';
import algoliasearch from 'algoliasearch';
import {
  InstantSearch,
  Configure,
  Highlight,
  connectSearchBox,
} from 'react-instantsearch-dom';
import Autocomplete from './AutoComplete';
import './Search.css';
import { USER_TYPE } from '../../../constants';
import { withTracker } from 'meteor/react-meteor-data';
import Spinner from '../../components/Spinner';

const VirtalSearchBox = connectSearchBox(() => null);

const applicationId = 'MONNJNMDPQ';
const apiKey = '2f5014a87ede4bf7488002662c92f22f';
const client = algoliasearch(applicationId, apiKey);

const index = client.initIndex('rep-profiles');

class Search extends Component {
  state = {
    query: '',
  };

  onSuggestionSelected = (_, { suggestion }) => {
    this.setState({
      query: suggestion.name,
    });
    this.props.history.push('/profile/' + suggestion.objectID);
  };

  onSuggestionCleared = () => {
    this.setState({
      query: '',
    });
  };

  render() {
    const { query } = this.state;
    const { propsReady, users } = this.props;

    if (propsReady) {
      const fetchDataFromDatabase = () => {
        const records = users.map(rep => {
          return {
            objectID: rep._id,
            name: rep.name,
            designation: rep.designation,
          };
        });
        return records;
      };

      const records = fetchDataFromDatabase();
      index.addObjects(records);
    }

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

Search.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withTracker(() => {
  const subscriberHandles = [Meteor.subscribe('users.all')];
  const propsReady = subscriberHandles.every(handle => handle.ready());
  let users = null;
  if (propsReady) {
    users = Meteor.users.find().fetch();
  }
  return {
    propsReady,
    users,
  };
})(Search);
