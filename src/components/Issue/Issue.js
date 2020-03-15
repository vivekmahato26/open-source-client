import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { TextField, Button } from "@material-ui/core";
import ChipInput from "material-ui-chip-input";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 500
  }
}));

export default function Issue(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  let chip = [];
  const handleChange = e => {
    chip = e;
    return 1;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addIssue = event => {
    event.preventDefault();

    const formTarget = event.target;
    const date = new Date().toISOString();
    let temp = formTarget.name.value;
    temp = temp.split(" ");
    let slug = "";
    temp.map(s => {
      if (slug === "") {
        slug = slug + s;
      } else {
        slug = slug + "-" + s;
      }
    });
    const requestBody = {
      query: `
            mutation{
              raiseIssue(issueInput:{projectId:"${props.projectId}",name:"${formTarget.name.value}",desc:"${formTarget.description.value}",status:"${formTarget.status.value}",slug:"${slug}",link:"${formTarget.link.value}",tag:"${chip}",createdAt:"${date}"}){
                name
                desc
                tag
                link
              }
            }
            `
    };
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/graphql", {
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
        const data = resData.data.addProject;
        if (data !== null) {
          handleClose();
          // window.location.reload(true);
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
          Add Issue
        </Button>
      )}
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <form className={classes.form} noValidate onSubmit={addIssue}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Issue Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                multiline
                name="description"
                label="Description"
                type="description"
                id="description"
                autoComplete="current-description"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="status"
                label="Status"
                name="status"
                autoComplete="status"
              />
              <ChipInput
                onChange={chips => handleChange(chips)}
                variant="outlined"
                margin="normal"
                label="Tags"
                id="tags"
                required
                fullWidth
                placeholder="Tags"
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
                Add Issue
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
