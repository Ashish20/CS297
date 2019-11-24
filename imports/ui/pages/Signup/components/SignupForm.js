import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { NavLink } from 'react-router-dom';
import Alert from '../../../components/Alert';
import { ISSUE_CATEGORIES, USER_TYPE } from '../../../../constants';
import FileUpload from '../../../components/FileUpload/FileUpload';
const debug = require('debug')('demo:file');

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="">
        Politracker
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: '#e8eaf6',
    },
  },
  paper: {
    borderRadius: '10px',
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingLeft: '10%',
    paddingRight: '10%',
    boxSizing: 'content-box',
    backgroundColor: '#fafafa',
    // boxSizing: '',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const top10Categories =
  // [
  // { id: 'water', name: 'Water' },
  // { id: 'electricity', name: 'Electricity' },
  // { id: 'road', name: 'Road' },
  // { id: 'university', name: 'University' },
  // { id: 'traffic', name: 'Traffic' },
  // { id: 'school', name: 'School' },
  // ];
  Object.values(ISSUE_CATEGORIES);

function renderRepresentativeComponent({ state, updateState }) {
  // const categories = this.state;

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="designation"
          label="Designation"
          name="designation"
          value={state.designation}
          onChange={e => updateState({ designation: e.target.value })}
        />
      </Grid>
      {/* {console.log(state.categories[0].text)} */}
      <Grid item xs={12}>
        <Autocomplete
          required
          multiple
          options={top10Categories}
          getOptionLabel={option => option.name}
          onChange={(event, value) =>
            updateState({ categories: value.map(val => val.id) })
          }
          renderTags={(value, { className, onDelete }) =>
            value.map((option, index) => (
              <Chip
                key={index}
                // disabled={index === 0}
                data-tag-index={index}
                tabIndex={-1}
                label={option.name}
                className={className}
                onDelete={onDelete}
              />
            ))
          }
          style={{ width: 500 }}
          renderInput={params => (
            <TextField
              {...params}
              label="Categories"
              variant="outlined"
              placeholder="Categories"
              fullWidth
              {...state.categories.length == 0 && { required: true }}
            />
          )}
        />
      </Grid>
    </React.Fragment>
  );
}

export default function SignUp({ state, updateState, handleSubmit }) {
  const classes = useStyles();
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  const [isRepresentative, setIsRepresentative] = React.useState(false);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  fileURL = url => {
    updateState({ imageURL: url });
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                // autoComplete="fname"
                variant="outlined"
                required
                fullWidth
                id="Name"
                label="Full Name"
                name="Name"
                autoFocus
                value={state.name}
                onChange={e => updateState({ name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={state.email}
                onChange={e => updateState({ email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="address"
                label="Street Address"
                name="address"
                value={state.address}
                onChange={e => updateState({ address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="zip"
                label="Zip"
                name="zip"
                value={state.zip}
                onChange={e => updateState({ zip: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={inputLabel} htmlFor="usertype-fields">
                  Register As
                </InputLabel>
                <Select
                  native
                  value={state.userType}
                  labelWidth={labelWidth}
                  onChange={e => {
                    setIsRepresentative(
                      e.target.value === USER_TYPE.REPRESENTATIVE.id
                    );
                    updateState({ userType: e.target.value });
                  }}
                  inputProps={{
                    name: 'userType',
                    id: 'usertype-fields',
                  }}
                >
                  <option value={USER_TYPE.CITIZEN.id}>
                    {USER_TYPE.CITIZEN.name}
                  </option>
                  <option value={USER_TYPE.REPRESENTATIVE.id}>
                    {USER_TYPE.REPRESENTATIVE.name}
                  </option>
                </Select>
              </FormControl>
            </Grid>

            {isRepresentative &&
              renderRepresentativeComponent({ state, updateState })}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={state.password}
                onChange={e => updateState({ password: e.target.value })}
              />
            </Grid>
          </Grid>

          <p>Upload Profile Photo:</p>
          <FileUpload
            fileURL={fileURL}
            // updateState={updateState}
          />

          {state.errMsg && <Alert errMsg={state.errMsg} />}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <NavLink to="/login">Already have an account?</NavLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
