import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import GitHubIcon from "@material-ui/icons/GitHub";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import InputAdornment from "@material-ui/core/InputAdornment";
import Fade from "@material-ui/core/Fade";
import clsx from 'clsx';
import {
  TextField,
  Button,
  Typography,
  CssBaseline,
  Container,
  Grid
} from "@material-ui/core";

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
    padding: theme.spacing(2, 4, 3)
  },
  margin: {
    margin: theme.spacing(1)
  },
  cardIcon: {
    width: "3rem",
    fontSize: "3rem"
  },
  textField: {
    width: 300,
  }
}));

const EditProfile = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = event => {
    const formTarget = event.target;
    const githubLink = formTarget.github.id + " https://github.com/" + formTarget.github.value;
    const linkedinLink =
      formTarget.linkedin.id + " https://www.linkedin.com/in/" + formTarget.linkedin.value;
    const facebookLink =
      formTarget.facebook.id + " https://www.facebook.com/" + formTarget.facebook.value;
    const twitterLink = formTarget.twitter.id + " https://www.twitter.com/" + formTarget.twitter.value;

    let social = [];
    social.push(githubLink, linkedinLink, facebookLink, twitterLink);
    const requestBody = {
      query: `
          mutation{
            updateUser(userInput:{name:"${formTarget.name.value}",bio:"${formTarget.bio.value}",social:"${social}"}){
              _id
              name
              sname
              bio
              social
            }
          }
          `
    };
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const data = resData.data.login;
        if (data !== null) {
          handleClose();
          window.location.reload(true);
        }
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
    event.preventDefault();
  };

  const classes = useStyles();
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Grid container spacing={3}>
        <Grid item xs={11} />
        <Grid item xs={1}>
          <Button
            style={{ float: "right" }}
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleOpen}
          >
            Edit
          </Button>
        </Grid>
      </Grid>

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
            <Typography component="h1" variant="h5">
              Edit Profile
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleUpdate}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
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
                name="bio"
                label="Bio"
                type="bio"
                id="bio"
                autoComplete="bio"
              />
                <Grid container spacing={3} alignItems="flex-end">
                  <Grid item xs={1}>
                    <GitHubIcon color="primary" className={classes.cardIcon} />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                    placeholder="johndoe"
                      id="github"
                      className={clsx(classes.margin, classes.textField)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            https://github.com/
                          </InputAdornment>
                        )
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <LinkedInIcon color="primary" className={classes.cardIcon} />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                    placeholder="johndoe"
                      id="linkedin"
                      className={clsx(classes.margin, classes.textField)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            https://www.linkedin.com/in/
                          </InputAdornment>
                        )
                      }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              
              
                <Grid container spacing={3} alignItems="flex-end">
                  <Grid item  xs={1}>
                    <FacebookIcon color="primary" className={classes.cardIcon} />
                  </Grid>
                  <Grid item  xs={5}>
                    <TextField
                    placeholder="johndoe"
                      id="facebook"
                      className={clsx(classes.margin, classes.textField)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            https://www.facebook.com/
                          </InputAdornment>
                        )
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item  xs={1}>
                    <TwitterIcon color="primary" className={classes.cardIcon} />
                  </Grid>
                  <Grid item  xs={5}>
                    <TextField
                    placeholder="johndoe"
                      id="twitter"
                      className={clsx(classes.margin, classes.textField)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            https://twitter.com/
                          </InputAdornment>
                        )
                      }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Update
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </Container>
  );
};

export default EditProfile;
