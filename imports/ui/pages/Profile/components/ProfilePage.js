import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { USER_TYPE } from '../../../../constants';

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function MediaCard() {
  const classes = useStyles();
  const userName = Meteor.user().name;
  const emailId = 'Email - ' + Meteor.user().emails[0].address;
  const userType = Meteor.user().userType;
  const address =
    'Address - ' + Meteor.user().address + ', Zip - ' + Meteor.user().zip;
  const designation = 'Designation - ' + Meteor.user().designation;

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="/imports/ui/pages/Profile/avatr.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {userName}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {address}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {emailId}
          </Typography>
          {userType === USER_TYPE.REPRESENTATIVE.id && (
            <div className="rep-fields">
              <Typography variant="body2" color="textSecondary" component="p">
                User Type - {userType}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {designation}
              </Typography>
            </div>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
