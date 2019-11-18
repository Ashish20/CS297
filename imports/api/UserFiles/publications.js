import UserFiles from './userFiles.js';
if (Meteor.isServer) {
    UserFiles.denyClient();
    Meteor.publish('files.all', function () {
      return UserFiles.find().cursor;
    });
  
  }