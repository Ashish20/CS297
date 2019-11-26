// Publications send to the client

import { Meteor } from 'meteor/meteor';
import Notification from './notification';

export const GET_USER_NOTIFICATIONS = 'NOTIFICATIONS';

if (Meteor.isServer) {
  // I am taking notifications as argument but not using it in order to make this
  // publication reactive. https://guide.meteor.com/data-loading.html#publishing-relations
  // This is a hack!!!
  Meteor.publish(GET_USER_NOTIFICATIONS, function(whichUserId, reload) {
    if (!this.userId) {
      return this.ready();
    }
    if (this.userId !== whichUserId) {
      return this.ready();
    }
    // const thisUser = Meteor.users.findOne(this.userId);
    const thisUser = Meteor.users.findOne(whichUserId, {
      notifications: 1,
    });

    if (!thisUser.notifications) {
      return this.ready();
    }
    // console.log('User notification', thisUser.notifications);
    return Notification.find({
      _id: { $in: thisUser.notifications },
    });
  });
}
