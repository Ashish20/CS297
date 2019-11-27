// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import Counters from '../../api/counters/counters.js';

Meteor.startup(() => {
  // check if db is empty, fill with fake data for testing
  process.env.MAIL_URL = 
      "smtp://postmaster@sandbox13e1cd1b700b4625b288156785d9439e.mailgun.org:aceab8ab1f4e15dcb7a15409aa01eeeb-09001d55-7f2d3880%40smtp.mailgun.org:587";
});

// Meteor.startup( function() {
//   process.env.MAIL_URL = 
//       "smtp://postmaster@sandbox13e1cd1b700b4625b288156785d9439e.mailgun.org:aceab8ab1f4e15dcb7a15409aa01eeeb-09001d55-7f2d3880%40smtp.mailgun.org:587";

//   Email.send({
//       to: "abhijeetb9890@gmail.com",
//       from: "fromemailadress@email.com",
//       subject: "Meteor Email",
//       text: "The email content..."
//   });
// });