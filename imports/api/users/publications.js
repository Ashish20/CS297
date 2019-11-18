// Publications to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { USER_TYPE } from '../../constants';

if (Meteor.isServer) {
  // all users publication (admin only)
  Meteor.publish('users.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Meteor.users.find();
    }
    return this.ready();
  });

  // current logged in user publication
  Meteor.publish('user', function() {
    if (this.userId) {
      return Meteor.users.find(
        { _id: this.userId },
        {
          fields: {
            emails: 1,
            profile: 1,
            status: 1,
            name: 1,
            address: 1,
            zip: 1,
            userType: 1,
            designation: 1,
            assignedIssues: 1,
            ownedIssues: 1,
            imageURL: 1,
          },
        }
      );
    }
    return this.ready();
  });

  // example same location users publication
  Meteor.publish('users.sameZip', function() {
    if (this.userId) {
      const user = Meteor.users.findOne(this.userId);
      // if (user.friendIds) {
      return Meteor.users.find(
        { zip: user.zip, userType: USER_TYPE.REPRESENTATIVE.id },
        {
          fields: {
            emails: 1,
            profile: 1,
            name: 1,
            designation: 1,
            zip: 1,
            userType: 1,
          },
        }
      );
    }
    return this.ready();
  });

  Meteor.publish('users.reps', function() {
    if (this.userId) {
      // if (user.friendIds) {
      return Meteor.users.find(
        { userType: USER_TYPE.REPRESENTATIVE.id },
        {
          fields: {
            emails: 1,
            profile: 1,
            name: 1,
            designation: 1,
            zip: 1,
            userType: 1,
          },
        }
      );
    }
    return this.ready();
  });

  // export const issueStateCount = new ValidatedMethod({
  //   name: 'issues.stateCount',
  //   mixins,
  //   beforeHooks: [beforeHookExample],
  //   afterHooks: [afterHookExample],
  //   checkLoggedInError,
  //   checkRoles: {
  //     roles: ['admin', 'user'],
  //     rolesError: {
  //       error: 'not-allowed',
  //       message: 'You are not allowed to call this method',
  //     },
  //   },
  //   validate: new SimpleSchema({
  //     assignedTo: { type: String },
  //     state: { type: String },
  //   }).validator(),
  //   run({ issueId, state }) {
  //     // throw new Meteor.Error(severity);
  //     if (Meteor.isServer) {
  //       return Issues.find({ assignedTo: issueId }, { state: { state } }).count();
  //     }
  //     // call code on client and server (optimistic UI)
  //   },
  // });
}

Meteor.publish('userProfile', function(userId) {
  if (userId) {
    return Meteor.users.find(
      { _id: userId },
      {
        fields: {
          emails: 1,
          profile: 1,
          status: 1,
          name: 1,
          address: 1,
          zip: 1,
          userType: 1,
          designation: 1,
          assignedIssues: 1,
          ownedIssues: 1,
          imageURL: 1,
        },
      }
    );
  }
  return this.ready();
});
