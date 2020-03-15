import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";
import GitHubIcon from "@material-ui/icons/GitHub";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";

import EditProfile from "./EditProfile";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 1200,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(3)
  },
  paper: {
    maxWidth: "100%",
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(3)
  },
  fontClass: {
    fontSize: "1rem"
  }
}));

const anchorStyle = {
    justifyContent: "center",
    display: "flex",
    textDecoration: "none",
    fontSize: "1rem",
    color: "#000"
}

export default function Profile(props) {
  const classes = useStyles();
  const userDetails = props.user;
  let userName = {};
  let social = {
    github: "",
    linkedin: "",
    facebook: "",
    twitter: ""
  };
  if (userDetails.social) {
    social = userDetails.social;
  }
  for (let [key, value] of Object.entries(social)) { 
    let temp = value.split("/");
    let t = temp.pop();
    userName[key] = t;
  }

  return (
    <>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={9}>
            <Paper className={classes.paper}>
              <AccountBoxRoundedIcon fontSize="large" color="primary" />
              <EditProfile/>
              <h3>{userDetails.name}</h3>
              <h4>{userDetails.sname}</h4>
              <Paper elevation={0} className={classes.fontClass}>{userDetails.bio}</Paper>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <a style={anchorStyle}
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubIcon color="primary" />
                    {userName.github}
                  </a>
                </Grid>
                <Grid item xs={3}>
                  <a style={anchorStyle}
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInIcon color="primary" />
                    {userName.linkedin}
                  </a>
                </Grid>
                <Grid item xs={3}>
                  <a style={anchorStyle}
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FacebookIcon color="primary" />
                    {userName.facebook}
                  </a>
                </Grid>
                <Grid item xs={3}>
                  <a style={anchorStyle}
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TwitterIcon color="primary" />
                    {userName.twitter}
                  </a>
                </Grid>
              </Grid>
            </Paper>
            <div>
              <h1>Contributions</h1>
              <h2>projects</h2>
              <h2>issues</h2>
              <h2>commits</h2>
            </div>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>news</Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
