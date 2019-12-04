import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import PropTypes from 'prop-types';
import SignupForm from './components/SignupForm';
// import UserFiles from '../../../api/UserFiles/userFiles'
// import styles
import './Signup.scss';
import { USER_TYPE } from '../../../constants';
import FileUpload from '../../components/FileUpload/FileUpload';
const debug = require('debug')('demo:file');
import superagent from 'superagent';
import sha1 from 'sha1';

class Signup extends React.Component {
  myWidget = cloudinary.createUploadWidget(
    {
      cloudName: 'politracker',
      uploadPreset: 'cusubgfk',
    },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        console.log('Done! Here is the image info: ', result.info);
        // console.log({result.secure_url});
        this.setState({ cloudinaryURL: result.info.secure_url });
        console.log(this.state.cloudinaryURL);
      }
    }
  );
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
      cloudinaryURL: null,
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

  dropzone = files => {
    const image = files[0];
    // const cloudName = 'politracker';
    const url = 'https://api.cloudinary.com/v1_1/politracker/image/upload';
    const preset = 'cusubgfk';
    const timestamp = Date.now() / 1000;
    const paramStr =
      'timestamp=' +
      timestamp +
      '&upload_preset=' +
      preset +
      '6QsYiCM4AXXujX0FjChsqGhXG7g';

    const signature = sha1(paramStr);

    const params = {
      api_key: '636368571654257',
      timestamp: timestamp,
      upload_preset: preset,
      signature: signature,
    };

    let uploadRequest = superagent.post(url);
    uploadRequest.attach('file', image);
    console.log(image);
    Object.keys(params).forEach(key => {
      uploadRequest.field(key, params[key]);
    });
    console.log(uploadRequest);

    uploadRequest.end((err, resp) => {
      if (err) {
        // callbackify(err, null)
        return;
      }
      console.log('UPLOAD COMPLETE' + JSON.stringify(resp.body));

      const uploaded = resp.body;
      let updatedImages = Object.assign([], this.state.images);
      updatedImages.push(uploaded);

      this.setState({
        images: updatedImages,
      });
    });
  };

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
      cloudinaryURL,
    } = this.state;
    console.log('CLOUDINARY URL:', this.state);
    Accounts.createUser(
      {
        email,
        password,
        profile: {
          userType,
          address,
          zip,
          name,
          designation,
          categories,
          imageURL,
          cloudinaryURL,
        },
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
          myWidget={this.myWidget}
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
