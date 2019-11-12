import React from 'react';
import { emphasize, withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { USER_TYPE, ISSUE_STATE } from '../../../constants';

const StyledBreadcrumb = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      //   backgroundColor: theme.palette.grey[300],
    },
    '&:active': {
      //   boxShadow: theme.shadows[1],
      //   backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
  label: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
}))(Chip); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  avatar: {
    background: 'none',
    marginRight: -theme.spacing(1.5),
  },
  sep: {
    marginRight: '0px',
    marginLeft: '0px',
  },

  makeBold: {
    fontWeight: 'bolder',
  },
}));

function makeBoldIfStateMatch(classes, label, issueState) {
  let className = '';
  console.log(typeof label);
  if (label === issueState) {
    className = classes.makeBold;
  }
  return className;
}

export default function ProgressIndicator({
  userTypeId,
  issueId,
  issueStateId,
  handleStateChange,
}) {
  const classes = useStyles();
  // console.log(classes);
  const userType = USER_TYPE[userTypeId];
  const issueState = ISSUE_STATE[issueStateId];

  function makeClickableIfRepresentative(issueState) {
    let clickability = {};
    if (userType === USER_TYPE.REPRESENTATIVE) {
      clickability = {
        onClick: event =>
          handleStateChange({ event, issueId, newState: issueState }),
      };
    }
    return clickability;
  }

  return (
    <Paper elevation={0} className={classes.root}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <NavigateNextIcon fontSize="small" />
        }
        classes={{ separator: classes.sep }}
      >
        <StyledBreadcrumb
          // classes={{ label: classes.label }}
          label={ISSUE_STATE.BACKLOG.name}
          {...makeClickableIfRepresentative(ISSUE_STATE.BACKLOG.id)}
          className={makeBoldIfStateMatch(
            classes,
            ISSUE_STATE.BACKLOG,
            issueState
          )}
        />
        <StyledBreadcrumb
          label={ISSUE_STATE.TODO.name}
          {...makeClickableIfRepresentative(ISSUE_STATE.TODO.id)}
          className={makeBoldIfStateMatch(
            classes,
            ISSUE_STATE.TODO,
            issueState
          )}
        />
        <StyledBreadcrumb
          //   style={{ fontWeight: 'bolder' }}
          label={ISSUE_STATE.INPROGRESS.name}
          {...makeClickableIfRepresentative(ISSUE_STATE.INPROGRESS.id)}
          className={makeBoldIfStateMatch(
            classes,
            ISSUE_STATE.INPROGRESS,
            issueState
          )}
        />
        <StyledBreadcrumb
          label={ISSUE_STATE.DONE.name}
          {...makeClickableIfRepresentative(ISSUE_STATE.DONE.id)}
          className={makeBoldIfStateMatch(
            classes,
            ISSUE_STATE.DONE,
            issueState
          )}
        />
      </Breadcrumbs>
    </Paper>
  );
}
