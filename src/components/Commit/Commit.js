import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {TextField,Button} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Commit(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addProject = event => {
    event.preventDefault();

    const formTarget = event.target;
    
    let temp = formTarget.message.value;
        temp = temp.split(" ");
        let slug = "";
        temp.map(s => {
          if(slug === "") {
            slug = slug + s;
          }
          else {
            slug = slug +"-"+s;
          }
          return slug;
        })
    const requestBody = {
      query: `
            mutation{
              addCommit(commitInput:{projectId:"${props.projectId}",commiter:"${formTarget.commiter.value}",message:"${formTarget.message.value}",link:"${formTarget.link.value}",slug:"${slug}"}){
                commiter
                message
                link
                slug
              }
            }
            `
    };
    const token = localStorage.getItem("token");
    fetch(" https://open-source-server.herokuapp.com/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const data = resData.data.addcommit;
        if (data !== null) {
          handleClose();
          //window.location.reload(true);
        }
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  };

  const token = localStorage.getItem("token");

  return (
    <div>
      {token && (
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleOpen}
        >
          Add Commit
        </Button>
      )}
      <Modal
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
          <div className={classes.paper}>
          <form className={classes.form} noValidate onSubmit={addProject}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="commiter"
            label="Commiter Name"
            name="commiter"
            autoComplete="commiter"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            multiline
            name="message"
            label="Message"
            type="message"
            id="message"
            autoComplete="current-message"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="link"
            label="Link"
            name="link"
            autoComplete="link"
          />
          <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Add Commit
        </Button>
        </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
