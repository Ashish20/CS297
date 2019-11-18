import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Chart from 'react-google-charts';
import Divider from '@material-ui/core/Divider';
import Issues from '../../../../api/issues/issues';
import { withTracker } from 'meteor/react-meteor-data';
import Spinner from '../../../components/Spinner';
import { USER_TYPE, ISSUE_STATE } from '../../../../constants';
// import Issues from '../../../../api/users/issues';
import UserFiles from '../../../../api/UserFiles/userFiles';
import './profilePage.scss';

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const options = {
  title: 'Status of Raised Issues',
  pieHole: 0.4,
  is3D: true,
};

function MediaCard({
  propsReady,
  backlogCount,
  todoCount,
  inProgressCount,
  completedCount,
  user,
  imageURL,
}) {
  const classes = useStyles();

  if (propsReady) {
    const userName = user.name;
    const emailId = 'Email - ' + user.emails[0].address;
    const userType = user.userType;
    const address = 'Address - ' + user.address + ', Zip - ' + user.zip;
    const designation = 'Designation - ' + user.designation;
    // var obj = require(Mongo).ObjectId;
    const imgURL = UserFiles.findOne({ _id: imageURL });
    const imgpath = imgURL.link();
    const data = [
      ['Task', 'Hours per Day'],
      ['In Progress', inProgressCount],
      ['To-Do', todoCount],
      ['Backlogged', backlogCount],
      ['Completed', completedCount],
    ];

    console.log('Backlog count ' + backlogCount);

    return (
      <React.Fragment>
        <Card className={classes.card}>
          <CardActionArea>
            {/* <CardMedia
              className={classes.media}
              image=""
              title="Contemplative Reptile"
            /> */}
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {userName}
              </Typography>
              <div>
                <img className="image" src={imgpath} />
              </div>
              <Typography variant="body2" color="textSecondary" component="p">
                {address}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {emailId}
              </Typography>
              {userType === USER_TYPE.REPRESENTATIVE.id && (
                <Typography variant="body2" color="textSecondary" component="p">
                  User Type - {userType}
                </Typography>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
        <Divider />
        {userType === USER_TYPE.REPRESENTATIVE.id && (
          <Chart
            chartType="PieChart"
            data={data}
            options={options}
            graph_id="PieChart"
            width={'100%'}
            height={'400px'}
            legend_toggle
          />
        )}
      </React.Fragment>
    );
  }

  return <Spinner />;
}

export default withTracker(props => {
  const subscriberHandles = [
    Meteor.subscribe('issues.stateCount', props.userId),
    Meteor.subscribe('userProfile', props.userId),
    // Meteor.subscribe('user'),
    Meteor.subscribe('files.all'),
  ];
  const propsReady = subscriberHandles.every(handle => handle.ready());
  // const usersColSubscriber = [Meteor.subscribe('user')];

  let backlogCount = 0;
  let todoCount = 0;
  let inProgressCount = 0;
  let completedCount = 0;
  let user = null;
  let imageURL = '';

  if (propsReady) {
    backlogCount = Issues.find({ state: ISSUE_STATE.BACKLOG.id }).count();
    todoCount = Issues.find({ state: ISSUE_STATE.TODO.id }).count();
    inProgressCount = Issues.find({ state: ISSUE_STATE.INPROGRESS.id }).count();
    completedCount = Issues.find({ state: ISSUE_STATE.DONE.id }).count();
    user = Meteor.users.findOne({ _id: props.userId });
    imageURL = user.imageURL;
  }

  return {
    // remote example (if using ddp)
    // usersReady,
    // users,
    propsReady,
    backlogCount,
    todoCount,
    inProgressCount,
    completedCount,
    user,
    imageURL,
  };
})(MediaCard);
