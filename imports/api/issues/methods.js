/* eslint-disable prefer-destructuring */
/**
 * Meteor methods
 */

import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { MethodHooks } from 'meteor/lacosta:method-hooks';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Meteor } from 'meteor/meteor';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import SimpleSchema from 'simpl-schema';
// import Users from '../users';
import { ISSUE_CATEGORIES, ISSUE_STATE, USER_TYPE } from '../../constants';
import {
  notifyCommentAddition,
  notifyUpvote,
  undoNotifyUpvote,
  notifyStateChange,
  notifyIssueAssignment,
} from '../notification/methods';
import Issues from './issues';
import { Email } from 'meteor/email';
import algoliasearch from 'algoliasearch';
/** **************** Helpers **************** */

const mixins = [LoggedInMixin, MethodHooks, CallPromiseMixin];

// not logged in error message
const checkLoggedInError = {
  error: 'notLogged',
  message: 'You need to be logged in to call this method',
  reason: 'You need to login',
};

/** **************** Methods **************** */

/**
 * countersIncrease
 */

// eslint-disable-next-line no-unused-vars, arrow-body-style
const beforeHookExample = (methodArgs, methodOptions) => {
  // console.log('countersIncrease before hook');
  // perform tasks
  return methodArgs;
};
// eslint-disable-next-line no-unused-vars, arrow-body-style
const afterHookExample = (methodArgs, returnValue, methodOptions) => {
  // console.log('countersIncrease: after hook:');
  // perform tasks
  return returnValue;
};

const applicationId = 'MONNJNMDPQ';
const apiKey = '2f5014a87ede4bf7488002662c92f22f';
const client = algoliasearch(applicationId, apiKey);

const index = client.initIndex('issues');

export const issueCreate = new ValidatedMethod({
  name: 'issues.insert',
  mixins,
  beforeHooks: [beforeHookExample],
  afterHooks: [afterHookExample],
  checkLoggedInError,
  checkRoles: {
    roles: ['admin', 'user'],
    rolesError: {
      error: 'not-allowed',
      message: 'You are not allowed to call this method',
    },
  },
  validate: null,
  // new SimpleSchema({
  //   category: {
  //     type: String,
  //     optional: false,
  //     allowedValues: Object.keys(ISSUE_CATEGORIES),
  //   },
  //   title: {
  //     type: String,
  //     optional: false,
  //   },
  //   description: {
  //     type: String,
  //     optional: false,
  //   },
  //   severity: {
  //     type: Number,
  //     optional: false,
  //     // decimal: true,
  //   },
  //   // zip code
  //   location: {
  //     type: String,
  //     optional: false,
  //   },
  //   assignedTo: {
  //     type: String,
  //     optional: false,
  //   },
  // }).validator()
  run({ category, title, description, location, assignedTo, imageURL }) {
    if (Meteor.isServer) {
      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }
      const ownerName = Meteor.user().name;
      const representative = Meteor.users.findOne(assignedTo);
      const assigneeName = representative.name;
      const ownerId = this.userId;
      const upVoters = [];
      const issueId = Issues.insert({
        category,
        title,
        description,
        location,
        assignedTo,
        ownerName,
        upVoters,
        imageURL,
        assigneeName,
      });
      Meteor.users.update(
        { _id: ownerId },
        { $push: { ownedIssues: issueId } }
      );
      notifyIssueAssignment.call({
        whoAssignedId: ownerId,
        toWhomId: representative._id,
        whichIssueId: issueId,
      });

      Meteor.users.update(
        { _id: assignedTo },
        { $push: { assignedIssues: issueId } }
      );

      console.log(issueId);

      const issue = {
        objectID: issueId,
        title: title,
        isssueDesc: description,
      };
      index.addObject(issue);
      return issueId;
    }

    // call code on client and server (optimistic UI)
  },
});

// export const issueUpdate = new ValidatedMethod({
//   name: 'issues.update',
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
//     issueId: { type: String },
//     severity: { type: Number },
//   }).validator(),
//   run({ issueId, severity }) {
//     // throw new Meteor.Error(severity);
//     if (Meteor.isServer) {
//       return Issues.update({ _id: issueId }, { $set: { severity } });
//     }
//     // call code on client and server (optimistic UI)
//   },
// });

export const issueUpdateState = new ValidatedMethod({
  name: 'issues.update.state',
  mixins,
  beforeHooks: [beforeHookExample],
  afterHooks: [afterHookExample],
  checkLoggedInError,
  checkRoles: {
    roles: ['admin', 'user'],
    rolesError: {
      error: 'not-allowed',
      message: 'You are not allowed to call this method',
    },
  },
  validate: new SimpleSchema({
    issueId: { type: String },
    newState: {
      type: String,
      optional: false,
      allowedValues: Object.keys(ISSUE_STATE),
    },
  }).validator(),
  run({ issueId, newState }) {
    if (Meteor.isServer) {
      if (Meteor.user().userType !== USER_TYPE.REPRESENTATIVE.id) {
        throw new Meteor.Error('Only representatives allowed to update state');
      }
      const issue = Issues.findOne({ _id: issueId });
      const oldState = issue.state;
      const updateStatus = Issues.update(
        { _id: issueId },
        { $set: { state: newState } }
      );
      notifyStateChange.call({
        whoChangedId: this.userId,
        onWhoseIssueId: issue.owner,
        onWhichIssueId: issueId,
        oldState,
        newState,
      });
      return updateStatus;
    }
  },
});

export const issueToggleUpVote = new ValidatedMethod({
  name: 'issues.update.upvotes',
  mixins,
  beforeHooks: [beforeHookExample],
  afterHooks: [afterHookExample],
  checkLoggedInError,
  checkRoles: {
    roles: ['admin', 'user'],
    rolesError: {
      error: 'not-allowed',
      message: 'You are not allowed to call this method',
    },
  },
  validate: new SimpleSchema({
    issueId: { type: String },
  }).validator(),
  run({ issueId }) {
    if (Meteor.isServer) {
      const userId = this.userId;
      const issue = Issues.findOne(issueId);
      if (issue.upVoters.includes(userId)) {
        Issues.update({ _id: issueId }, { $pull: { upVoters: userId } });
        if (this.userId !== issue.owner) {
          undoNotifyUpvote.call({
            whoUpvotedId: userId,
            onWhoseIssueId: issue.owner,
            onWhichIssueId: issue._id,
          });
        }
      } else {
        Issues.update({ _id: issueId }, { $addToSet: { upVoters: userId } });
        if (this.userId !== issue.owner) {
          notifyUpvote.call({
            whoUpvotedId: userId,
            onWhoseIssueId: issue.owner,
            onWhichIssueId: issue._id,
          });
        }
      }
    }
  },
});

export const issueAddComment = new ValidatedMethod({
  name: 'issues.update.addComment',
  mixins,
  beforeHooks: [beforeHookExample],
  afterHooks: [afterHookExample],
  checkLoggedInError,
  checkRoles: {
    roles: ['admin', 'user'],
    rolesError: {
      error: 'not-allowed',
      message: 'You are not allowed to call this method',
    },
  },
  validate: new SimpleSchema({
    issueId: { type: String },
    comment: { type: String },
  }).validator(),
  run({ issueId, comment }) {
    if (Meteor.isServer) {
      const userId = this.userId;
      const userName = Meteor.user().name;
      const issue = Issues.findOne(issueId);
      const commentObject = {
        author: {
          id: userId,
          name: userName,
        },
        content: comment,
      };
      const updateStatus = Issues.update(
        { _id: issueId },
        { $push: { comments: commentObject } }
      );

      console.log('Comment add status', updateStatus);

      // notify if others comment on the owner's issue
      if (this.userId !== issue.owner) {
        notifyCommentAddition.call({
          whoCommentedId: userId,
          onWhoseIssueId: issue.owner,
          onWhichIssueId: issueId,
          comment: commentObject,
        });
      }
    }
  },
});

export const issueDelete = new ValidatedMethod({
  name: 'issues.delete',
  mixins,
  beforeHooks: [beforeHookExample],
  afterHooks: [afterHookExample],
  checkLoggedInError,
  checkRoles: {
    roles: ['admin', 'user'],
    rolesError: {
      error: 'not-allowed',
      message: 'You are not allowed to call this method',
    },
  },
  validate: new SimpleSchema({
    issueId: { type: String },
  }).validator(),

  run({ issueId }) {
    if (Meteor.isServer) {
      // secure code - not available on the client
      console.log('issue id owner ', Issues.findOne(issueId));
      console.log(issueId);
      if (!this.userId || Issues.findOne(issueId).owner !== this.userId) {
        throw new Meteor.Error('not-authorized');
      }
      const removeStatus = Issues.remove(issueId);
      console.log(removeStatus);
      return removeStatus;
    }
    // call code on client and server (optimistic UI)
  },
});
// /**
//  * used for example test in methods.tests.js
//  */
// export const countersInsert = new ValidatedMethod({
//   name: 'counters.insert',
//   mixin: [CallPromiseMixin],
//   validate: null,
//   run() {
//     const _id = Random.id();
//     // console.log('counters.insert', _id);
//     const counterId = Counters.insert({
//       _id,
//       count: Number(0),
//     });
//     return counterId;
//   },
// });
if (Meteor.isServer) {
  Meteor.methods({
    sendEmail(to, from, subject, text) {
      // Make sure that all arguments are strings.
      // check([to, from, subject, text], [String]);

      // Let other method calls from the same client start running, without
      // waiting for the email sending to complete.
      this.unblock();

      console.log('send email called');

      console.log('to', to);
      console.log('from', from);
      console.log('subject', subject);
      console.log('text', text);

      const status = Email.send({ to, from, subject, text });

      console.log('Send email status', status);
    },
  });
}
