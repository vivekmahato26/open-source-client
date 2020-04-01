import React from "react";
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
import Issue from "../components/Issue/Issue";
import AddProject from "../components/project/AddProject"; 
import UpdateProject from "../components/project/UpdateProject";

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
  display: "flex",
  textDecoration: "none",
  fontSize: "1rem",
  color: "#2979ff",
  padding: "5px",
  margin: "5px"
};

function SingleProject(props) {
  const classes = useStyles();
  let community = [
    {
      key: "website",
      icon: <LinkIcon color="primary" />,
    },
    {
      key: "github",
      icon: <GitHubIcon color="primary" />,
    },
    {
      key: "discord",
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
    },
    {
      key: "slack",
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
    },
    {
      key: "twitter",
      icon: <TwitterIcon color="primary" />,
    },
    {
      key: "facebook",
      icon: <FacebookIcon color="primary" />,
    }
  ];

  let projPage;
  const token = localStorage.getItem("token");

  if (props.location.state.type === "card") {
    projPage = <AddProject />
  } else {
    const projectDetails = props.location.state.project.project;
    projPage = (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Card className={classes.sticky}>
                <Typography component="span" style={{ textAlign: "center" }}>
                  <p>{projectDetails.name}</p>
                  <a href={projectDetails.organization.website} style={{textDecoration:"none",display:"block"}} target="_blank">
                        <Chip
                          style={chip}
                         
                          avatar={
                            <Avatar>
                              {projectDetails.organization.name[0]}
                            </Avatar>
                          }
                          label={projectDetails.organization.name}
                          clickable
                          color="primary"
                          variant="outlined"
                        />
                      </a>
                  <div className="underline"></div>
                  <p>{projectDetails.category}</p>
                </Typography>
                <div className={classes.chip}>
                  {community.map(c => {
                    let link = projectDetails.community[c.key];
                    let site;
                    if(link){
                      site = link.slice(8);
                    }
                    return (
                      <a href={link} style={anchorStyle} target="_blank">
                        <Chip
                          style={chip}
                          key={c.key}
                          avatar={
                            <Avatar className={classes.mainWhite}>
                              {c.icon}
                            </Avatar>
                          }
                          label={site}
                          clickable
                          variant="outlined"
                        />
                      </a>
                    );
                  })}
                </div>
                <UpdateProject project={projectDetails}/>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <Typography component="span" style={{ textAlign: "center" }}>
                  <p>{projectDetails.desc}</p>
                </Typography>
                <Typography component="span" style={{ textAlign: "center" }}>
                  <p>Who's using {projectDetails.name} ?</p>
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
                  {token && <Issue projectId={projectDetails._id} />}
                  <div className="underline"></div>
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }

  return <>{projPage}</>;
}

export default SingleProject;
