import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Spinner from '../../components/Spinner';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { USER_TYPE } from '../../../constants';
import UserFiles from '../../../api/UserFiles/userFiles';
import './AssignedIssues.scss';
// import { issueInsert } from '../../../api/issues/issues.js';

import {
  Image,
  Video,
  Transformation,
  CloudinaryContext,
} from 'cloudinary-react';
// import cloudinary from 'cloudinary-core';
// const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'politracker'});
import Dropzone from 'react-dropzone';
import superagent from 'superagent';
import sha1 from 'sha1';

import {
  issueCreate,
  issueDelete,
  issueUpdate,
} from '../../../api/issues/methods';
import Issues from '../../../api/issues/issues';
import { ISSUE_CATEGORIES } from '../../../constants';
import FileUpload from '../../components/FileUpload/FileUpload';
// import { callbackify } from 'util';
const debug = require('debug')('demo:file');
// import Users from '../../../api/users/users';

class AssignedIssues extends React.Component {
  initialState = {};
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
    this.initialState = {
      title: '',
      description: '',
      category: '',
      // location: '',
      assignedTo: '',
      category_options: Object.keys(ISSUE_CATEGORIES),
      assignedRepList: [],
      imageURL: '',
      uploading: [],
      progress: 0,
      inProgress: false,
      resetFile: null,
      images: [],
      cloudinaryURL: null,
    };
    this.state = this.initialState;
  }

  componentDidMount() {
    const { loggedIn, history, propsReady, user } = this.props;
    if (!loggedIn) {
      return history.push('/login');
    }
    // while (!userReady);
    // this.initialState.location = user.zip;
    // this.setState(this.initialState);
    if (propsReady) {
      console.log('ComponentDidMount', this.props);
      const assignedRepList = this.props.sameZipRep.map(rep => {
        return {
          name: rep.name + ' - ' + rep.designation,
          id: rep._id,
          // designation: rep.designation,
        };
      });
      console.log('Inside mount ' + assignedRepList);
      this.setState({ assignedRepList });
    }
  }

  componentDidUpdate(prevProps) {
    // console.log(this.props);
    if (
      this.props.propsReady &&
      prevProps.sameZipRep !== this.props.sameZipRep
    ) {
      // console.log(this.props.sameZ)
      const assignedRepList = this.props.sameZipRep.map(rep => {
        return {
          name: rep.name + ' - ' + rep.designation,
          id: rep._id,
        };
      });
      this.setState({ assignedRepList });
    }
  }

  getUser = id => {
    const owner = Meteor.users.findOne(id);
    // console.log(owner);
    return owner;
  };

  renderIssues = () => {
    let link = UserFiles.findOne(
      { _id: this.state.imageURL },
      { _id: 0, path: 1 }
    );

    const { assignedIssues } = this.props;
    const listOfIssues = assignedIssues.map(issue => (
      <div key={issue._id} className="container">
        <li className="list-group-item">
          <div className="card">
            <h5 className="card-header">{this.getUser(issue.owner).name}</h5>
            <div className="card-body">
              <h5 className="card-title">{issue.title}</h5>
              <p className="card-text">{issue.description}</p>
              <div>
                {' '}
                <img src={link} />{' '}
              </div>
              <p className="card-text" key={issue._id}>
                {issue.createdOn.toDateString()}
              </p>
              <button
                type="button"
                className="btn btn-danger"
                onClick={e => this.handleRemove(e, issue._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      </div>
    ));
    return listOfIssues;
  };

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

  handleRemove = (event, issueId) => {
    event.preventDefault();
    // Meteor.call('issues.remove', issueId);
    issueDelete.call({ issueId });
  };

  // renderCategoryOptions = () => {
  //   const options = [];
  //   for (let [key, value] of Object.entries(ISSUE_CATEGORIES)) {
  //     options.push(<option value={value.name}> {value.name}</option>);
  //   }
  //   const OPTIONS = options.reduce((prev, curr) => prev + curr);
  //   // console.log(options);
  //   console.log(OPTIONS);
  //   return OPTIONS;
  // };
  // getAssignedTasks() {
  //   return Meteor.methods('getTasksAssignedTo', Meteor.userId())
  // }
  handleSubmit = event => {
    event.preventDefault();
    const {
      title,
      description,
      category,
      // location,
      assignedTo,
      imageURL,
      cloudinaryURL,
    } = this.state;
    console.log(typeof category, category);
    issueCreate.call({
      category,
      title,
      description,
      location: this.props.user.zip,
      assignedTo,
      imageURL,
      cloudinaryURL,
    });
    // this.state.resetFile.call();
    this.reset();
  };

  reset() {
    this.setState(this.initialState);
  }

  // let resetFile = null;
  fileURL = (url, clearFile) => {
    this.setState({ imageURL: url, resetFile: clearFile });
  };

  // updateState = (newstate) => {
  // }

  // handleCloudUpload = () => {
  //   this.myWidget.open();
  // }

  render() {
    const { assignedIssues, propsReady, user } = this.props;
    console.log('CLOUDINARY ', cloudinary);

    //let imagePath = this.props.fileName;

    // var widget = cloudinary.createUploadWidget({
    //   cloudName: "demo", uploadPreset: "preset1" }, (error, result) => { });

    // const list =this.state.images.map((image, i) => {
    //   return (
    //     <li key = {i}>
    // <img src = {image.secure_url}/>
    {
      /* </li>
      
      )
    }) */
    }

    return !propsReady ? (
      <Spinner />
    ) : (
      <React.Fragment>
        <div className="container">
          <h1>AssignedIssues Page</h1>
          <div className="row">
            <div className="col">
              <section className="create-issue-form">
                <div className="card mx-auto">
                  <div className="card-body">
                    <h4 className="card-title">Create Issue </h4>
                    <form onSubmit={e => this.handleSubmit(e)}>
                      <div className="form-group">
                        <label htmlFor="issueTitle">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          id="issueTitle"
                          name="issueTitle"
                          placeholder="Issue Title"
                          value={this.state.title}
                          onChange={e =>
                            this.setState({ title: e.target.value })
                          }
                        />
                      </div>
                      {/* <div className="form-group">
                        <label htmlFor="issueSeverity">Severity</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          className="form-control"
                          id="issueSeverity"
                          placeholder="Issue Severity"
                          value={this.state.severity}
                          onChange={e =>
                            this.setState({
                              severity: parseInt(e.target.value, 10),
                            })
                          }
                        />
                      </div> */}
                      <div className="form-group">
                        <label htmlFor="issueLocation">Zip</label>
                        <input
                          type="text"
                          className="form-control"
                          id="issueLocation"
                          placeholder="Issue Location"
                          value={this.props.user.zip}
                          readOnly="readonly"
                          // onChange={e => this.setState({ location: value })}
                        />
                      </div>
                      <div className="form-group">
                        <Autocomplete
                          id="combo-box-demo"
                          options={this.state.assignedRepList}
                          getOptionLabel={option => option.name}
                          style={{ width: 300 }}
                          onChange={(event, value) =>
                            this.setState({
                              assignedTo: value.id,
                            })
                          }
                          renderInput={params => (
                            <TextField
                              {...params}
                              label="Assigned To"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        />
                      </div>
                      {/* <div className="form-group">
                    <label htmlFor="assignedTo">Assigned To</label>
                    <input
                      type="text"
                      className="form-control"
                      id="assignedTo"
                      placeholder="Assign to"
                      value={this.state.assignedTo.name}
                      onChange={e =>
                        this.setState({ assignedTo: e.target.value })
                      }
                    />
                  </div> */}
                      <div className="form-group">
                        <label htmlFor="issueCategory">Category</label>
                        <select
                          className="form-control"
                          name="issueCategory"
                          value={this.state.category}
                          onChange={e =>
                            this.setState({ category: e.target.value })
                          }
                          required
                        >
                          <option value="" disabled selected>
                            Select Category
                          </option>
                          {/* <option value="roads">roads</option>
                      <option value="water">water</option>
                      <option value="electricity">electricity</option>
                      <option value="traffic">traffic</option>
                      <option value="school">school</option>
                      <option value="university">university</option>
                       */}
                          {this.state.category_options.map(key => {
                            const categoryProps = ISSUE_CATEGORIES[key];
                            return (
                              <option
                                key={categoryProps.id}
                                value={key.toString()}
                              >
                                {categoryProps.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="issueDescription">Description</label>
                        <textarea
                          className="form-control"
                          id="issueDescription"
                          rows="3"
                          value={this.state.description}
                          onChange={e =>
                            this.setState({ description: e.target.value })
                          }
                        />
                      </div>
                      <p>Upload Issue Image: </p>
                      {/* <FileUpload
                        fileURL={this.fileURL}
                      /> */}

                      {/* {widget.open()}; */}

                      {/* <Dropzone onDrop = {this.dropzone.bind(this)}/> */}
                      {/* <input type="file" onChange={e => this.dropzone(e)}/> */}

                      <button
                        id="upload_widget"
                        type="button"
                        className="cloudinary-button"
                        onClick={() => this.myWidget.open()}
                      >
                        Upload files
                      </button>

                      {/* <Grid> */}
                      <img
                        style={{
                          height: '60px',
                          width: '60px',
                          border: '0',
                        }}
                        src={this.state.cloudinaryURL}
                      />

                      {/* <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript">  </script>
                      
                      <script type="text/javascript">  
                        var myWidget = cloudinary.createUploadWidget({
                          cloudName= 'politracker', 
                          uploadPreset= 'cusubgfk'},
                        )

                        
                            myWidget.open();
                      </script> */}

                      {/* <img src={cloudinaryCore.url('sample')} /> */}
                      {/* {console.log("CCCLLLOOOUUUDDD")}
                      <img src='https://res.cloudinary.com/politracker/image/upload/v1574851729/sjb9pstsyp2s64xxismw.jpg' />
                      { Cloudinary_Upload_Widget} */}
                      {/* <Image cloudName="politracker" publicId="sample" width="300" crop="scale" /> */}

                      {/* {console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSS")}
                      {console.log(this.state.imageURL)} */}
                      {/* <p>{
                          {}
                        }</p> */}
                      <div className="form-group no-margin">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block mb-2"
                        >
                          Create Issue
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
            <div className="col">
              <section className="issue-list">
                <div className="card" style={{ width: '18rem' }}>
                  <ul className="list-group list-group-flush">
                    {this.renderIssues()}
                  </ul>
                </div>
                {/* <RecipeReviewCard
              issue={issuesReady ? assignedIssues[0] : ''}
              user={userReady ? user : ''}
            /> */}
              </section>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

AssignedIssues.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.object.isRequired,
  assignedIssues: PropTypes.arrayOf(PropTypes.any).isRequired,
  propsReady: PropTypes.bool.isRequired,
  sameZipRep: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default withTracker(() => {
  // remote example (if using ddp)
  /*
  const usersSub = Remote.subscribe('users.friends'); // publication needs to be set on remote server
  const users = Users.find().fetch();
  const usersReady = usersSub.ready() && !!users;
  */

  // counters example
  const subscriberHandles = [
    Meteor.subscribe('issues'),
    Meteor.subscribe('files.all'),
    Meteor.subscribe('users.sameZip'),
  ];

  const assignedIssues = Issues.find({ owner: Meteor.userId() }).fetch();
  const user = Meteor.user();
  // We need specific query because of multiple publications
  // const sameZipRep =
  //   user != null
  //     ? Meteor.users
  //         .find({ zip: user.zip, userType: USER_TYPE.REPRESENTATIVE.id })
  //         .fetch()
  //     : '';
  let sameZipRep;
  if (user != null) {
    sameZipRep = Meteor.users
      .find({ zip: user.zip, userType: USER_TYPE.REPRESENTATIVE.id })
      .fetch();
  } else {
    sameZipRep = null;
  }
  // const sameZipRep = Meteor.users.find().fetch();
  // const issuesReady = issuesSub.ready() && !!assignedIssues;
  // const userReady = userSub.ready() && !!user;
  // const samZipRepReady = sameZipRepSub.ready() && !!sameZipRep;
  console.log(subscriberHandles.every(handle => handle.ready()));
  const propsReady =
    subscriberHandles.every(handle => handle.ready()) &&
    !!assignedIssues &&
    !!user &&
    !!sameZipRep;
  console.log(sameZipRep);
  // const zip = userReady && user.zip;

  // let imagedoc = null;
  // let fileName = '';

  // if(this.state.imageURL !== null){
  //   imagedoc = UserFiles.findOne({ _id:this.state.imageURL});
  //   fileName = imagedoc.link();
  // }

  return {
    // remote example (if using ddp)
    // usersReady,
    // users,
    // userReady,
    user,
    // issuesReady,
    assignedIssues,
    // samZipRepReady,
    sameZipRep,
    // zip,
    propsReady,
    // fileName,
  };
})(AssignedIssues);
