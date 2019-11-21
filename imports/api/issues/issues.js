// Collection definition

import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { ISSUE_STATE, ISSUE_CATEGORIES } from '../../constants';
// define collection
const Issues = new Meteor.Collection('issues');

// define schema
const schema = new SimpleSchema({
  _id: {
    type: String,
  },
  category: {
    type: String,
    allowedValues: Object.keys(ISSUE_CATEGORIES),
    optional: false,
  },
  title: {
    type: String,
    optional: false,
  },
  description: {
    type: String,
    optional: false,
  },
  // severity: {
  //   type: Number,
  //   optional: false,
  //   min: 1,
  //   max: 10,
  //   // decimal: true,
  // },
  // zip code
  location: {
    type: String,
    optional: false,
  },
  // owner user id
  owner: {
    type: String,
    optional: false,
    autoValue() {
      if (this.isInsert && (!this.isFromTrustedCode || !this.isSet)) {
        return this.userId;
      }
      return undefined;
    },
    denyUpdate: true,
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
  assignedTo: {
    type: String,
    optional: false,
  },
  state: {
    type: String,
    optional: false,
    allowedValues: Object.keys(ISSUE_STATE),
    autoValue() {
      if (this.isInsert && !this.isSet) return ISSUE_STATE.BACKLOG.id;
    },
  },
  ownerName: {
    type: String,
    optional: false,
  },
  upVoters: {
    // array of issue ids, we will also store userids in issue
    type: Array,
    optional: true,
  },
  'upVoters.$': String,
  comments: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'comments.$': Object,
  'comments.$.author': Object,
  'comments.$.author.id': String,
  'comments.$.author.name': String,
  'comments.$.content': String,
  imageURL: {
    type: String,
    optional: true,
  },
  assigneeName: {
    type: String,
    optional: false,
  },
});

// attach schema
Issues.attachSchema(schema);

export default Issues;
