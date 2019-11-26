import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IndividualFile from './FileIndividualFile.js';
import UserFiles from '../../../api/UserFiles/userFiles'
import { issueUpdateState } from '../../../api/issues/methods.js';

const debug = require('debug')('demo:file');

class FileUploadComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // link: [],
      uploading: [],
      progress: 0,
      inProgress: false
    };

    this.uploadIt = this.uploadIt.bind(this);
  }

  clearFile = () => {
     // Remove the filename from the upload box
     this.refs['fileinput'].value = '';
  }

  uploadIt(e, fileURL, clearFile) {
    e.preventDefault();

    let self = this;

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      var file = e.currentTarget.files[0];
      
      if (file) {
        let uploadInstance = UserFiles.insert({
          file: file,
          meta: {
            locator: self.props.fileLocator,
            userId: Meteor.userId() // Optional, used to check on server for file tampering
          },
          streams: 'dynamic',
          chunkSize: 'dynamic',
          allowWebWorkers: false // If you see issues with uploads, change this to false
        }, false)

        self.setState({
          uploading: uploadInstance, // Keep track of this instance to use below
          inProgress: true // Show the progress bar now
        });

        // These are the event functions, don't need most of them, it shows where we are in the process
        uploadInstance.on('start', function () {
          console.log('Starting');
        })

        uploadInstance.on('end', function (error, fileObj) {
          console.log('On end File Object: ', fileObj);
          // const insertedFile = UserFiles.findOne({_id: fileObj._id}).link();
          fileURL(fileObj._id, clearFile);
          // updateState({imageURL: fileObj._id})
        })

        uploadInstance.on('uploaded', function (error, fileObj) {
          console.log('uploaded: ', fileObj);         

          // Reset our state for the next file
          self.setState({
            uploading: [],
            progress: 0,
            inProgress: false
          });


        })

        uploadInstance.on('error', function (error, fileObj) {
          console.log('Error during upload: ' + error)
        });

        uploadInstance.on('progress', function (progress, fileObj) {
          console.log('Upload Percentage: ' + progress)
          // Update our progress bar
          self.setState({
            progress: progress
          });
        });

        uploadInstance.start(); // Must manually start the upload
      }
    }
  }

  // This is our progress bar, bootstrap styled
  // Remove this function if not needed
  showUploads() {
    console.log('**********************************', this.state.uploading);

    if (!_.isEmpty(this.state.uploading)) {
      return <div>
        {this.state.uploading.file.name}

        <div className="progress progress-bar-default">
          <div style={{width: this.state.progress + '%'}} aria-valuemax="100"
             aria-valuemin="0"
             aria-valuenow={this.state.progress || 0} role="progressbar"
             className="progress-bar">
            <span className="sr-only">{this.state.progress}% Complete (success)</span>
            <span>{this.state.progress}%</span>
          </div>
        </div>
      </div>
    }
  }

  // propTypes : {
  //   fileURL : PropTypes.string.isRequired
  // }
  handleUpload(event, fileUrl) {
      this.uploadIt(event, fileUrl, this.clearFile);
    
  }

  render() {
    debug("Rendering FileUpload",this.props.docsReadyYet);
    if (this.props.files && this.props.docsReadyYet) {

      let fileCursors = this.props.files;
      // let filePath = [];
      // Run through each file that the user has stored
      // (make sure the subscription only sends files owned by this user)
      let display = fileCursors.map((aFile, key) => {
        // console.log('A file: ', aFile.link(), aFile.get('name'))
        let link = UserFiles.findOne({_id: aFile._id}).link();  //The "view/download" link
        // this.setState({link});
        // filePath.push(link);
        // Send out components that show details of each file
        return <div key={'file' + key}>
          <IndividualFile
            fileName={aFile.name}
            fileUrl={link}
            fileId={aFile._id}
            fileSize={aFile.size}
          />
        </div>
      })

      return <div>
        <div className="row">
          <div className="col-md-12">
            {/* <p>Upload Image:</p> */}


            {/* <button  class="btn btn-default">Upload</button>
            <div style={{visibility: hidden}, {position: absolute}, {overflow: hidden}, {width: 0}, {height:0}, {border:none}, {margin:0}, {padding:0}}>
              <input type="file"  ng2FileSelect />
            </div> */}


            <input type="file"  id="fileinput" disabled={this.state.inProgress} ref="fileinput"
                 onChange={e => this.handleUpload(e, this.props.fileURL)}/>
          </div>
        </div>

        <div className="row m-t-sm m-b-sm">
          <div className="col-md-6">

            {this.showUploads()}

          </div>
          <div className="col-md-6">
          </div>
        </div>

        {display}

      </div>
    }
    else return <div>Loading file list</div>;
  }
}

//
// This is the HOC - included in this file just for convenience, but usually kept
// in a separate file to provide separation of concerns.
//

export default withTracker( ( props ) => {
  const filesHandle = Meteor.subscribe('files.all');
  const docsReadyYet = filesHandle.ready();
  const files = UserFiles.find({}, {sort: {name: 1}}).fetch();

  // console.log("User files", files);
  // console.log("docsready", docsReadyYet);

  return {
    docsReadyYet,
    files,
  };
})(FileUploadComponent);