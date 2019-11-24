import { List, ListItem } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { ISSUE_STATE, USER_TYPE } from '../../../constants';

const SmallChip = withStyles({
  root: {
    height: '24px',
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
})(Chip);

const BacklogChip = withStyles({
  root: {
    backgroundColor: '#546e7a',
    height: '24px',
  },
  label: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
})(SmallChip);

const TodoChip = withStyles({
  root: {
    backgroundColor: '#757575',
  },
})(SmallChip);
const InProgressChip = withStyles({
  root: {
    backgroundColor: '#1e88e5',
  },
})(SmallChip);
const DoneChip = withStyles({
  root: {
    backgroundColor: '#43a047',
  },
})(SmallChip);

export default function SplitButton({
  userId,
  assignedTo,
  userTypeId,
  issueId,
  issueStateId,
  handleStateChange,
}) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(
    ISSUE_STATE[issueStateId].id
  );
  // console.log(classes);
  const userType = USER_TYPE[userTypeId];

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    handleStateChange({ event, issueId, newState: index });
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const renderSelected = onClick => {
    switch (selectedIndex) {
      case ISSUE_STATE.BACKLOG.id: {
        return <BacklogChip onClick={onClick} label={ISSUE_STATE.BACKLOG.id} />;
      }
      case ISSUE_STATE.INPROGRESS.id: {
        return (
          <InProgressChip onClick={onClick} label={ISSUE_STATE.INPROGRESS.id} />
        );
      }
      case ISSUE_STATE.TODO.id: {
        return <TodoChip onClick={onClick} label={ISSUE_STATE.TODO.id} />;
      }
      case ISSUE_STATE.DONE.id: {
        return <DoneChip onClick={onClick} label={ISSUE_STATE.DONE.id} />;
      }
      default: {
        return '';
      }
    }
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        {/* <ButtonGroup
          variant="contained"
          color="primary"
          ref={anchorRef}
          aria-label="split button"
        >
          <Button onClick={handleToggle}>{selectedIndex}</Button>
        </ButtonGroup> */}
        <List>
          <ListItem ref={anchorRef} variant="extended">
            {renderSelected(
              userType === USER_TYPE.REPRESENTATIVE && assignedTo === userId
                ? handleToggle
                : undefined
            )}
          </ListItem>
        </List>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList id="split-button-menu">
              <MenuItem
                key={ISSUE_STATE.BACKLOG.id}
                // disabled={index === 2}
                // selected={index === selectedIndex}
                onClick={event =>
                  handleMenuItemClick(event, ISSUE_STATE.BACKLOG.id)
                }
              >
                <BacklogChip label={ISSUE_STATE.BACKLOG.id} />
              </MenuItem>

              <MenuItem
                key={ISSUE_STATE.TODO.id}
                // disabled={index === 2}
                // selected={index === selectedIndex}
                onClick={event =>
                  handleMenuItemClick(event, ISSUE_STATE.TODO.id)
                }
              >
                <TodoChip label={ISSUE_STATE.TODO.id} />
              </MenuItem>

              <MenuItem
                key={ISSUE_STATE.INPROGRESS.id}
                // disabled={index === 2}
                // selected={index === selectedIndex}
                onClick={event =>
                  handleMenuItemClick(event, ISSUE_STATE.INPROGRESS.id)
                }
              >
                <InProgressChip label={ISSUE_STATE.INPROGRESS.id} />
              </MenuItem>

              <MenuItem
                key={ISSUE_STATE.DONE.id}
                // disabled={index === 2}
                // selected={index === selectedIndex}
                onClick={event =>
                  handleMenuItemClick(event, ISSUE_STATE.DONE.id)
                }
              >
                <DoneChip label={ISSUE_STATE.DONE.id} />
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Popper>
      </Grid>
    </Grid>
  );
}
