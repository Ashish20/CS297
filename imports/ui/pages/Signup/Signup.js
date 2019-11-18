import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import PropTypes from 'prop-types';
import SignupForm from './components/SignupForm';
// import UserFiles from '../../../api/UserFiles/userFiles'
// import styles
import './Signup.scss';
import { USER_TYPE } from '../../../constants';
import FileUpload from '../../components/FileUpload/FileUpload'
const debug = require('debug')('demo:file');

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      userType: USER_TYPE.CITIZEN.id,
      errMsg: '',
      address: '',
      zip: '',
      designation: '',
      categories: [],
      imageURL: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  updateState(newState) {
    this.setState(newState);
  }

  componentWillMount() {
    if (this.props.loggedIn) {
      return this.props.history.push('/newsfeed');
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.loggedIn) {
      nextProps.history.push('/newsfeed');
      return false;
    }
    return true;
  }

  handleSubmit(e) {
    e.preventDefault();
    const {
      email,
      password,
      userType,
      address,
      zip,
      name,
      designation,
      categories,
      imageURL,
    } = this.state;
    Accounts.createUser(
      {
        email,
        password,
        profile: { userType, address, zip, name, designation, categories, imageURL },
      },
      err => {
        if (err) {
          this.setState({ errMsg: err.reason });
          return console.log(err);
        }
      }
    );
  }

  render() {
    if (this.props.loggedIn) {
      return null;
    }

    return (
      <section className="signup-page">
        <SignupForm
          state={this.state}
          updateState={this.updateState}
          handleSubmit={this.handleSubmit}
        />
      </section>
    );
  }
}

Signup.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Signup;
