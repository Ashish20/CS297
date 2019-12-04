import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  modal: {
    position: 'absolute',
    overflow: 'scroll',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function TransitionsModal({ open, handleClose, render }) {
  const classes = useStyles();

  return (
    <div>
      <Modal
        // style={{
        //   top: '5%',
        //   topMargin: '5px',
        //   left: '25%',
        //   leftMargin: '300px',
        // }}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Grid container>
            <Grid item xs={1} md={3} onClick={handleClose} />
            <Grid item xs={10} md={6}>
              {render()}
            </Grid>
            <Grid item xs={1} md={3} onClick={handleClose} />
          </Grid>
        </Fade>
      </Modal>
    </div>
  );
}
