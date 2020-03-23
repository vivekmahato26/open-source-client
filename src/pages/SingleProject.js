import React, { useState} from "react";
import { withRouter } from "react-router";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { IconContext } from "react-icons";
import LinkIcon from "@material-ui/icons/Link";
import GitHubIcon from "@material-ui/icons/GitHub";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import { FaDiscord, FaSlack } from "react-icons/fa";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    maxWidth: 1200,
    background: "#e8e8e8",
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(3)
  },
  menuItems: {
    "&:hover": {
      color: "#2979ff",
      textDecoration: "underLine"
    }
  },
  mainWhite: {
    backgroundColor: "#fff"
  },
  sticky: {
    position: "sticky",
    top: "11%"
  },
  chip: {
    "& > .fa": {
      margin: theme.spacing(2)
    }
  }
}));

const chip = {
  background: "#fff"
};

const anchorStyle = {
  justifyContent: "center",
  display: "flex",
  textDecoration: "none",
  fontSize: "1rem",
  color: "#2979ff",
  padding: "5px",
  margin: "5px"
};

function SingleProject(props) {
  const classes = useStyles();
  const [community, setCommunity] = useState([
    {
      key: "Website",
      icon: <LinkIcon color="primary" />,
      value: "Website"
    },
    {
      key: "Github",
      icon: <GitHubIcon color="primary" />,
      value: "Github"
    },
    {
      key: "Discord",
      icon: (
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
      ),
      value: "Discord"
    },
    {
      key: "Slack",
      icon: (
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
      ),
      value: "Slack"
    },
    {
      key: "Twitter",
      icon: <TwitterIcon color="primary" />,
      value: "Twitter"
    },
    {
      key: "Facebook",
      icon: <FacebookIcon color="primary" />,
      value: "Facebook"
    }
  ]);

  const projectDetails = props.location.state.project.project;
  return (
    <>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Card className={classes.sticky}>
                <Typography component="span" style={{ textAlign: "center" }}>
                  <p>{projectDetails.name}</p>
                  <p>{projectDetails.orgination}</p>
                  <div className="underline"></div>
                  <p>{projectDetails.category}</p>
                </Typography>
                <div className={classes.chip}>
                  {community.map(c => {
                    return (
                      <a targer="_blank" href={c.link} style={anchorStyle}>
                        <Chip
                          style={chip}
                          key={c.key}
                          avatar={
                            <Avatar className={classes.mainWhite}>
                              {c.icon}
                            </Avatar>
                          }
                          label={c.value}
                          clickable
                          variant="outlined"
                        />
                      </a>
                    );
                  })}
                </div>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <Typography component="span" style={{ textAlign: "center" }}>
                  <p>{projectDetails.desc}</p>
                </Typography>
                <Typography component="span" style={{ textAlign: "center" }}>
                  <p>Who's using {projectDetails.name}?</p>
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card>
              <Typography component="span" style={{ textAlign: "center" }}>
                  <p>Contributers</p>
                  <div className="underline"></div>
                </Typography>
                <Typography component="span" style={{ textAlign: "center" }}>
                  <p>Issues</p>
                  <div className="underline"></div>
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
}

export default withRouter(SingleProject);
