/* eslint-disable react/jsx-wrap-multilines */
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Edit } from 'styled-icons/boxicons-regular/Edit';
import { issueCreate } from '../../../api/issues/methods';
import { ISSUE_CATEGORIES, USER_TYPE } from '../../../constants';
import TransitionsModal from '../TransitionModal/TransitionModal';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  grid: {
    padding: theme.spacing(4),
  },

  label: {
    marginLeft: '10px',
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    padding: theme.spacing(2),
    width: '100%',
  },
  media: {
    height: 360,
  },
}));

function RaiseIssueForm({
  propsReady,
  repList,
  userLocation,
  issueImage,
  myWidget,
  setIssueImage,
}) {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [location, setLocation] = useState(userLocation);
  const [category, setCategory] = useState(ISSUE_CATEGORIES.ROAD.id);
  // const [cloudinaryURL, setCloudinaryURL] = useState(null);
  const [assignedTo, setAssignedTo] = useState(null);
  const classes = useStyles();
  const handleSubmit = () => {
    issueCreate.call({
      category,
      title,
      description,
      location,
      assignedTo,
      // imageURL,
      cloudinaryURL: issueImage,
    });

    setTitle(null);
    setDescription(null);
    setAssignedTo(null);
    setIssueImage(null);
  };
  if (!propsReady) {
    return <CircularProgress />;
  }
  return (
    <Paper>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container alignItems="center" justify="center" spacing={1}>
          <Grid xs={12} item>
            <TextField
              label="Title"
              defaultValue={title}
              className={classes.textField}
              margin="normal"
              required
              variant="outlined"
              onChange={e => setTitle(e.target.value)}
              InputLabelProps={{
                className: classes.label,
              }}
            />
          </Grid>

          <Grid xs={12} item>
            <TextField
              label="Description"
              defaultValue={description}
              className={classes.textField}
              margin="normal"
              required
              multiline
              variant="outlined"
              onChange={e => setDescription(e.target.value)}
              InputLabelProps={{
                className: classes.label,
              }}
            />
          </Grid>
          {issueImage && (
            <Grid xs={12} item>
              <Card className={classes.card}>
                <CardContent>
                  <CardMedia
                    className={classes.media}
                    image={issueImage}
                    title="Contemplative Reptile"
                  />
                </CardContent>
              </Card>
            </Grid>
          )}

          <Grid xs={12} item>
            <Autocomplete
              margin="normal"
              id="combo-box-demo"
              options={repList}
              getOptionLabel={option => option.name}
              style={{ marginLeft: '25px', marginRight: '10px' }}
              onChange={(event, value) => setAssignedTo(value.id)}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Add an officer"
                  variant="outlined"
                  fullWidth
                />
              )}
              renderOption={option => {
                return (
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={option.avatar}>
                          {option.name.substring(0, 1)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={option.name} />
                    </ListItem>
                  </List>
                );
              }}
            />
          </Grid>
          <Grid xs={6} item align="center">
            <CameraAltIcon fontSize="large" onClick={() => myWidget.open()} />
          </Grid>
          <Grid xs={6} item align="center">
            <Button variant="contained" color="primary" type="submit">
              Post
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
let myWidget = null;

function PostIssue({ propsReady, repList, user }) {
  const classes = useStyles();
  const [showModal, setShowModal] = useState(false);
  const [issueImage, setIssueImage] = useState(null);
  // const [myWidget, setMyWidget] = useState(null);

  useEffect(() => {
    console.log('use effect post issue ', myWidget);
    if (myWidget === null)
      myWidget = cloudinary.createUploadWidget(
        {
          cloudName: 'politracker',
          uploadPreset: 'cusubgfk',
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            console.log('Done! Here is the image info: ', result.info);
            setIssueImage(result.info.secure_url);
          }
        }
      );
    console.log('after init mywidget', myWidget);
  });

  if (!propsReady) {
    return <CircularProgress />;
  }
  return (
    <React.Fragment>
      <Paper className={classes.card}>
        <Link
          href="#"
          onClick={e => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          <Grid
            container
            alignItems="center"
            // justify="center"
            style={{ flexWrap: 'nowrap' }}
            className={classes.grid}
            spacing={1}
          >
            <Grid item>
              <Edit size="30" />
            </Grid>
            <Grid item>
              <Typography>Post Issue</Typography>
            </Grid>
          </Grid>
        </Link>
      </Paper>

      <TransitionsModal
        open={showModal}
        handleClose={() => setShowModal(false)}
        render={() => (
          <RaiseIssueForm
            propsReady={propsReady}
            repList={repList}
            userLocation={user.zip}
            issueImage={issueImage}
            myWidget={myWidget}
            setIssueImage={setIssueImage}
          />
        )}
      />
    </React.Fragment>
  );
}

export default withTracker(() => {
  const subscriberHandles = [
    Meteor.subscribe('issues'),
    Meteor.subscribe('files.all'),
    Meteor.subscribe('users.sameZip'),
  ];

  const user = Meteor.user();
  let repList = null;
  if (user != null) {
    repList = Meteor.users
      .find({ zip: user.zip, userType: USER_TYPE.REPRESENTATIVE.id })
      .fetch()
      .map(rep => {
        return {
          name: rep.name + '-' + rep.designation,
          id: rep._id,
          avatar: rep.cloudinaryURL,
        };
      });
  }
  const propsReady =
    subscriberHandles.every(handle => handle.ready()) && !!user && !!repList;

  return {
    user,
    repList,
    propsReady,
  };
})(PostIssue);
