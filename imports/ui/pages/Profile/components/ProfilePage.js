import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Chart from 'react-google-charts';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Issues from '../../../../api/issues/issues';
import { withTracker } from 'meteor/react-meteor-data';
import Spinner from '../../../components/Spinner';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { USER_TYPE, ISSUE_STATE } from '../../../../constants';
import UserFiles from '../../../../api/UserFiles/userFiles';
import Issue from '../../../components/Issue/Issue';
import './profilePage.scss';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 500,
    marginBottom: '10px',
    marginTop: '10px',

    // backgrounColor: '#e8eaf6',
  },
  media: {
    height: 0,
    paddingTop: '80%',
  },

  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    alignItems: 'center',
    justifyContents: 'center',
  },
}));

const options = {
  title: 'Status of Raised Issues',
  pieHole: 0.4,
  is3D: true,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function MediaCard({
  propsReady,
  backlogCount,
  todoCount,
  inProgressCount,
  completedCount,
  user,
  imageURL,
  myIssues,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  if (propsReady) {
    const userName = user.name;
    const emailId = 'Email - ' + user.emails[0].address;
    const userType = user.userType;
    const address = 'Address - ' + user.address + ', Zip - ' + user.zip;
    const designation = 'Designation - ' + user.designation;
    // var obj = require(Mongo).ObjectId;
    const imgURL = UserFiles.findOne({ _id: imageURL });
    // const imgpath = imgURL && imgURL.link();
    const imgpath = Meteor.user().cloudinaryURL;
    console.log("CLOUDINARY URL ", imgpath);
    const data = [
      ['Issue Status', 'Count'],
      ['In Progress', inProgressCount],
      ['To-Do', todoCount],
      ['Backlogged', backlogCount],
      ['Completed', completedCount],
    ];

    const isRepresentative = userType === USER_TYPE.REPRESENTATIVE.id;

    console.log('Backlog count ' + backlogCount);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Profile tabs"
            centered
          >
            <Tab label="User Details" {...a11yProps(0)} />
            {isRepresentative && <Tab label="Analytics" {...a11yProps(1)} />}
            {!isRepresentative && <Tab label="Issues" {...a11yProps(1)} />}
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Grid container spacing={6}>
              <Grid item xs={3} />
              <Grid item xs={6}>
                <Card className={classes.card}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={imgpath}
                      title="Profile picture"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {userName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {address}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {emailId}
                      </Typography>
                      {isRepresentative && (
                        <>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            User Type - {userType}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            {designation}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          {isRepresentative && (
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Chart
                chartType="PieChart"
                data={data}
                options={options}
                graph_id="PieChart"
                width={'100%'}
                height={'400px'}
                legend_toggle
              />
            </TabPanel>
          )}
        </SwipeableViews>
        {!isRepresentative && (
          <TabPanel value={value} index={1} dir={theme.direction}>
            {myIssues.map(issue => (
              // eslint-disable-next-line no-unused-expressions
              <Issue
                issueId={issue._id}
                issue={issue}
                // onDragStop={this.onDragStop}
              />
            ))}
          </TabPanel>
        )}
      </div>
    );
  }

  return <Spinner />;
}

export default withTracker(props => {
  const subscriberHandles = [
    Meteor.subscribe('issues.stateCount', props.userId),
    Meteor.subscribe('userProfile', props.userId),
    Meteor.subscribe('issues'),
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
  let myIssues = null;

  if (propsReady) {
    backlogCount = Issues.find({
      state: ISSUE_STATE.BACKLOG.id,
      assignedTo: props.userId,
    }).count();
    todoCount = Issues.find({
      state: ISSUE_STATE.TODO.id,
      assignedTo: props.userId,
    }).count();
    inProgressCount = Issues.find({
      state: ISSUE_STATE.INPROGRESS.id,
      assignedTo: props.userId,
    }).count();
    completedCount = Issues.find({
      state: ISSUE_STATE.DONE.id,
      assignedTo: props.userId,
    }).count();
    user = Meteor.users.findOne({ _id: props.userId });
    imageURL = user.imageURL;
    myIssues = Issues.find(
      { owner: props.userId },
      { sort: { createdOn: -1 } }
    ).fetch();
    console.log(myIssues);
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
    myIssues,
  };
})(MediaCard);
