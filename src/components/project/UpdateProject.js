import React, {useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import GitHubIcon from "@material-ui/icons/GitHub";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import { FaDiscord, FaSlack } from "react-icons/fa";
import LinkIcon from "@material-ui/icons/Link";
import InputAdornment from "@material-ui/core/InputAdornment";
import Fade from "@material-ui/core/Fade";
import clsx from "clsx";
import { IconContext } from "react-icons";
import {
  TextField,
  Button,
  
  CssBaseline,
  
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
//import { Link } from "react-router-dom";


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
    width: "2rem",
    fontSize: "2rem"
  },
  textField: {
    width: 600,
    "& > div > input": {
      padding: "10px"
    }
  },
  buttons: {
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    "& > *": {
      margin: "5px"
    }
  }
}));

const UpdateProject = props => {
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  let chip = [];
  
  const handleChange = e => {
    chip = e;
    return 1;
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleUpdate = event => {
    const formTarget = event.target;
    const githubLink = " https://github.com/" + formTarget.github.value;
    const website = " https://" + formTarget.website.value;
    const facebookLink =
      " https://www.facebook.com/" + formTarget.facebook.value;
    const twitterLink = " https://www.twitter.com/" + formTarget.twitter.value;
    const slackLink = " https://www.slack.com/" + formTarget.slack.value;
    const discordLink = " https://www.discord.com/" + formTarget.discord.value;
    const requestBody = {
      query: `
          mutation{
            updateProject(updateInput:{projectId:"${props.project._id}",
            community:{ 
                github: "${githubLink}",
                website: "${website}",
                facebook: "${facebookLink}",
                twitter: "${twitterLink}",
                slack: "${slackLink}",
                discord: "${discordLink}"
            },
            adopter:"${chip}"}){
              _id
              name
              community {
                  website
                  facebook
                  github
                  slack
                  twitter
                  discord
              }
            }
          }
          `
    };
    fetch(" https://open-source-server.herokuapp.com/graphql", {
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
        const data = resData.data.updateProject;
        if (data !== null) {
          handleClose();
          //window.location.reload(true);
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
    <>
      <CssBaseline />
      {token && (
        <div className={classes.buttons}>
          <Button
            style={{ width: "auto" }}
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleOpen}
          >
            Update
          </Button>
        </div>
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
            <form className={classes.form} noValidate onSubmit={handleUpdate}>
              <div className={classes.buttons}>
                <LinkIcon color="primary" className={classes.cardIcon} />

                <TextField
                  placeholder={props.project.name}
                  id="website"
                  className={clsx(classes.margin, classes.textField)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">https://</InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </div>
              <div className={classes.buttons}>
                <GitHubIcon color="primary" className={classes.cardIcon} />

                <TextField
                  placeholder="project"
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
              </div>
              <div className={classes.buttons}>
                <IconContext.Provider
                  value={{
                    color: "#3f51b5",
                    size: "1.5em",
                    className: "global-class-name"
                  }}
                >
                  <div>
                    <FaSlack />
                  </div>
                </IconContext.Provider>

                <TextField
                  placeholder="project"
                  id="slack"
                  className={clsx(classes.margin, classes.textField)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        https://slack.com/
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </div>
              <div className={classes.buttons}>
                <IconContext.Provider
                  value={{
                    color: "#3f51b5",
                    size: "1.5em",
                    className: "global-class-name"
                  }}
                >
                  <div>
                    <FaDiscord />
                  </div>
                </IconContext.Provider>

                <TextField
                  placeholder="project"
                  id="discord"
                  className={clsx(classes.margin, classes.textField)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        https://discord.com/
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </div>

              <div className={classes.buttons}>
                <FacebookIcon color="primary" className={classes.cardIcon} />

                <TextField
                  placeholder="project"
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
              </div>
              <div className={classes.buttons}>
                <TwitterIcon color="primary" className={classes.cardIcon} />

                <TextField
                  placeholder="project"
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
              </div>
              <ChipInput
                onChange={chips => handleChange(chips.toString())}
                variant="outlined"
                margin="normal"
                label="Adopters"
                id="adopters"
                required
                fullWidth
                placeholder="Adopters"
              />
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
    </>
  );
};

export default UpdateProject;
