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
import { NOTIFICATION_CATEGORIES, USER_TYPE } from '../../constants';
import Issues from '../issues/issues';
import Notification from './notification';

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

// eslint-disable-next-line import/prefer-default-export
export const notifyCommentAddition = new ValidatedMethod({
  name: 'notification.commentAdded',
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
    whoCommentedId: {
      type: String,
      optional: false,
    },
    onWhoseIssueId: {
      type: String,
      optional: false,
    },
    onWhichIssueId: {
      type: String,
      optional: false,
    },
    comment: {
      type: Object,
      blackbox: true,
      optional: false,
    },
  }).validator(),
  run({ whoCommentedId, onWhoseIssueId, onWhichIssueId, comment }) {
    if (Meteor.isServer) {
      const whoCommented = Meteor.users.findOne(whoCommentedId);
      const onWhoseIssue = Meteor.users.findOne(onWhoseIssueId);
      const onWhichIssue = Issues.findOne(onWhichIssueId);

      if (!whoCommented)
        throw new Meteor.Error('Invalid commenter', whoCommentedId);

      if (!onWhoseIssue)
        throw new Meteor.Error('Invalid owner', onWhoseIssueId);

      if (!onWhichIssue)
        throw new Meteor.Error('Invalid issue', onWhichIssueId);

      if (!this.userId && whoCommented._id) {
        // secure code - not available on the client
        throw new Meteor.Error('not-authorized');
      }
      if (onWhoseIssue._id !== onWhichIssue.owner) {
        throw new Meteor.Error('invalid data');
      }

      const notificationId = Notification.insert({
        category: NOTIFICATION_CATEGORIES.COMMENT.id,
        message: `${whoCommented.name} commented on issue ${
          onWhichIssue.title
        }`,
        actorId: whoCommentedId,
        subjectId: onWhoseIssueId,
        targetId: onWhichIssueId,
        comment,
      });
      Meteor.users.update(
        { _id: onWhoseIssueId },
        {
          $push: {
            notifications: {
              $each: [notificationId],
              $position: 0,
            },
          },
          $inc: {
            newNotificationsCount: 1,
          },
        }
      );
      return notificationId;
    }
    // call code on client and server (optimistic UI)
  },
});

export const resetNotificationCounter = new ValidatedMethod({
  name: 'notification.counter.reset',
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
    userId: {
      type: String,
      optional: false,
    },
  }).validator(),
  run({ userId }) {
    if (Meteor.isServer) {
      Meteor.users.update(
        { _id: userId },
        { $set: { newNotificationsCount: 0 } }
      );
    }
    // call code on client and server (optimistic UI)
  },
});
