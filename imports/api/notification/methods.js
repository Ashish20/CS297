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

      if (!this.userId) {
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

export const notifyUpvote = new ValidatedMethod({
  name: 'notification.newUpvote',
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
    whoUpvotedId: {
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
  }).validator(),
  run({ whoUpvotedId, onWhoseIssueId, onWhichIssueId, comment }) {
    if (Meteor.isServer) {
      const whoUpvoted = Meteor.users.findOne(whoUpvotedId);
      const onWhoseIssue = Meteor.users.findOne(onWhoseIssueId);
      const onWhichIssue = Issues.findOne(onWhichIssueId);

      if (!whoUpvotedId)
        throw new Meteor.Error('Invalid upvoter', whoUpvotedId);

      if (!onWhoseIssue)
        throw new Meteor.Error('Invalid owner', onWhoseIssueId);

      if (!onWhichIssue)
        throw new Meteor.Error('Invalid issue', onWhichIssueId);

      if (!this.userId) {
        // secure code - not available on the client
        throw new Meteor.Error('not-authorized');
      }
      if (onWhoseIssue._id !== onWhichIssue.owner) {
        throw new Meteor.Error('invalid data');
      }

      const notificationId = Notification.insert({
        category: NOTIFICATION_CATEGORIES.UPVOTE.id,
        message: `${whoUpvoted.name} upvoted issue ${onWhichIssue.title}`,
        actorId: whoUpvotedId,
        subjectId: onWhoseIssueId,
        targetId: onWhichIssueId,
        // comment,
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
      console.log('UPVOTE', onWhoseIssue.notifications);
      console.log('UPVOTE', notificationId);
      return notificationId;
    }
    // call code on client and server (optimistic UI)
  },
});

export const undoNotifyUpvote = new ValidatedMethod({
  name: 'notification.newUpvote.Undo',
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
    whoUpvotedId: {
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
  }).validator(),
  run({ whoUpvotedId, onWhoseIssueId, onWhichIssueId }) {
    if (Meteor.isServer) {
      const whoUpvoted = Meteor.users.findOne(whoUpvotedId);
      const onWhoseIssue = Meteor.users.findOne(onWhoseIssueId);
      const onWhichIssue = Issues.findOne(onWhichIssueId);

      if (!whoUpvotedId)
        throw new Meteor.Error('Invalid upvoter', whoUpvotedId);

      if (!onWhoseIssue)
        throw new Meteor.Error('Invalid owner', onWhoseIssueId);

      if (!onWhichIssue)
        throw new Meteor.Error('Invalid issue', onWhichIssueId);

      if (!this.userId) {
        // secure code - not available on the client
        throw new Meteor.Error('not-authorized');
      }
      if (onWhoseIssue._id !== onWhichIssue.owner) {
        throw new Meteor.Error('invalid data');
      }

      if (!whoUpvoted) {
        throw new Meteor.Error('invalid data');
      }

      const notificationId = Notification.findOne({
        category: NOTIFICATION_CATEGORIES.UPVOTE.id,
        // message: `${whoUpvoted.name} upvoted issue ${onWhichIssue.title}`,
        actorId: whoUpvotedId,
        subjectId: onWhoseIssueId,
        targetId: onWhichIssueId,
      })._id;

      // console.log(notificationId);
      // console.log(Meteor.user());
      const indexOfNotificationId = onWhoseIssue.notifications.indexOf(
        notificationId
      );

      console.log(indexOfNotificationId);
      const unOpenedNotificationCount = onWhoseIssue.newNotificationsCount;

      if (indexOfNotificationId < unOpenedNotificationCount) {
        console.log('unseen notice');
        Meteor.users.update(
          { _id: onWhoseIssueId },
          {
            $pull: {
              notifications: notificationId,
            },
            $inc: {
              newNotificationsCount: -1,
            },
          }
        );
      } else {
        console.log('seen notice');
        Meteor.users.update(
          { _id: onWhoseIssueId },
          {
            $pull: {
              notifications: notificationId,
            },
          }
        );
      }

      Notification.remove({ _id: notificationId });
      console.log('DOwnVote', onWhoseIssue.notifications);

      return notificationId;
    }
    // call code on client and server (optimistic UI)
  },
});

export const notifyStateChange = new ValidatedMethod({
  name: 'notification.stateChange',
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
    whoChangedId: {
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
    oldState: {
      type: String,
      optional: false,
    },
    newState: {
      type: String,
      optional: false,
    },
  }).validator(),
  run({ whoChangedId, onWhoseIssueId, onWhichIssueId, oldState, newState }) {
    if (Meteor.isServer) {
      const whoChanged = Meteor.users.findOne(whoChangedId);
      const onWhoseIssue = Meteor.users.findOne(onWhoseIssueId);
      const onWhichIssue = Issues.findOne(onWhichIssueId);

      if (!whoChanged)
        throw new Meteor.Error('Invalid commenter', whoChangedId);

      if (!onWhoseIssue)
        throw new Meteor.Error('Invalid owner', onWhoseIssueId);

      if (!onWhichIssue)
        throw new Meteor.Error('Invalid issue', onWhichIssueId);

      if (!this.userId) {
        // secure code - not available on the client
        throw new Meteor.Error('not-authorized');
      }
      if (onWhoseIssue._id !== onWhichIssue.owner) {
        throw new Meteor.Error('invalid data');
      }

      const notificationId = Notification.insert({
        category: NOTIFICATION_CATEGORIES.ISSUE_STATE_CHANGE.id,
        message: `${whoChanged.name} changed state of issue ${
          onWhichIssue.title
        }`,
        actorId: whoChangedId,
        subjectId: onWhoseIssueId,
        targetId: onWhichIssueId,
        issueStateChange: {
          oldState,
          newState,
        },
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
  },
});
