// Collection definition

import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { NOTIFICATION_STATE, NOTIFICATION_CATEGORIES } from '../../constants';
import Issues from '../issues/issues';
// define collection
const Notification = new Meteor.Collection('notification');

// define schema
const schema = new SimpleSchema({
  _id: {
    type: String,
  },
  category: {
    type: String,
    allowedValues: Object.keys(NOTIFICATION_CATEGORIES),
    optional: false,
  },
  message: {
    type: String,
    optional: true,
  },

  // person who triggered the notification
  actorId: {
    type: String,
    optional: false,
  },

  // person who will consume the notification
  subjectId: {
    type: String,
    optional: false,
  },

  // the resource which links the actor with the subject. Example issue id
  targetId: {
    type: String,
    optional: false,
  },

  createdOn: {
    type: Date,
    optional: false,
    autoValue() {
      if (this.isInsert && !this.isSet) {
        return new Date();
      }
    },
    denyUpdate: true,
  },

  state: {
    type: String,
    optional: false,
    allowedValues: Object.keys(NOTIFICATION_STATE),
    autoValue() {
      if (this.isInsert && !this.isSet) return NOTIFICATION_STATE.UNREAD.id;
    },
  },

  comment: {
    type: Object,
    optional: true,
    blackbox: true,
  },
});

// attach schema
Notification.attachSchema(schema);

Notification.helpers({
  actor() {
    return Meteor.users.findOne(this.actorId);
  },
  subject() {
    return Meteor.users.findOne(this.subjectId);
  },
  target() {
    return Issues.findOne(this.targetId);
  },
});
export default Notification;
