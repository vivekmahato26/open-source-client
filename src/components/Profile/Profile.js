import React, {useState} from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Paper, Card } from "@material-ui/core";
import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";
import GitHubIcon from "@material-ui/icons/GitHub";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";


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
    fontSize: "1rem",
    background: "#f7f7f7",
    padding: 5,
    marginBottom: 8
  },
  social: {
    display: "flex",
    alignItems: "center"
  },
  mainWhite: {
    backgroundColor: "#fff"
  },
  justify: {
    justifyContent: "center",
    display: "flex"
  },
  title: {
    fontSize: 14,
    display: "-webkit-box",
    alignItems: 'center',
    '& > *': {
      margin: "1px",
    }
  }
}));

const anchorStyle = {
  justifyContent: "center",
  display: "flex",
  textDecoration: "none",
  fontSize: "1rem",
  color: "#2979ff"
};

export default function Profile(props) {
  const classes = useStyles();
  const userDetails = props.user;
  const [projects,setProjects] = useState({ projects: [] });
  const [length, setLength] = useState(0);
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
  const fetchProjects = (arg) => {
    if(arg) {
      arg = `"${arg}"`;
    }
    else {
      arg = null;
    }
    const requestBody = {
      query: `
            query {
              projects(projectFilter:{tag:[null],category:null,userId:${arg}}){
                _id
                name
                slug
                category
              }
            }
          `
    };

    fetch(" https://open-source-server.herokuapp.com/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const projects = resData.data.projects;
        setProjects({ projects });
      })
      .catch(err => {
        console.log(err);
      });
  };
  const userId = localStorage.getItem('userId');
  if (length === 0) {
    fetchProjects(userId);
    setLength(Object.keys(projects).length);
  }
  const projectsDetails = projects.projects;

  return (
    <>
      <div className={classes.root}>
        <Grid style={{ background: "#e8e8e8" }} container spacing={3}>
          <Grid item xs={9}>
            <Paper className={classes.paper}>
              <AccountBoxRoundedIcon fontSize="large" color="primary" />
              <EditProfile />
              <h3>{userDetails.name}</h3>
              <h4>{userDetails.sname}</h4>
              <Paper className={classes.fontClass}>{userDetails.bio}</Paper>
              <Grid container spacing={3} className={classes.social}>
                <Grid item xs={3}>
                  <a
                    style={anchorStyle}
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Chip
                      avatar={
                        <Avatar className={classes.mainWhite}>
                          {" "}
                          <GitHubIcon color="primary" />
                        </Avatar>
                      }
                      label={userName.github}
                      clickable
                      variant="outlined"
                    />
                  </a>
                </Grid>
                <Grid item xs={3}>
                  <a
                    style={anchorStyle}
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Chip
                      avatar={
                        <Avatar className={classes.mainWhite}>
                          <LinkedInIcon color="primary" />
                        </Avatar>
                      }
                      label={userName.linkedin}
                      clickable
                      variant="outlined"
                    />
                  </a>
                </Grid>
                <Grid item xs={3}>
                  <a
                    style={anchorStyle}
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Chip
                      avatar={
                        <Avatar className={classes.mainWhite}>
                          <FacebookIcon color="primary" />
                        </Avatar>
                      }
                      label={userName.facebook}
                      clickable
                      variant="outlined"
                    />
                  </a>
                </Grid>
                <Grid item xs={3}>
                  <a
                    style={anchorStyle}
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Chip
                      avatar={
                        <Avatar className={classes.mainWhite}>
                          {" "}
                          <TwitterIcon color="primary" />
                        </Avatar>
                      }
                      label={userName.twitter}
                      clickable
                      variant="outlined"
                    />
                  </a>
                </Grid>
              </Grid>
            </Paper>
              <Paper className={classes.paper}>
                <Grid container spacing={3} >
                    <Card>
                    <h3 >Projects</h3>
                      {projectsDetails && projectsDetails.slice(0,4).map(project => {
                        const projectId = project._id;
                        return (<Typography component={"span"}
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        <Link
                          to={{
                            pathname: `/projects/${project.slug}`,
                            state: {
                              projectId: { projectId }
                            }
                          }}
                          style={anchorStyle}
                        >
                          {project.name}
                        </Link>
                        <Chip
                            avatar={<Avatar>{project.category[0].toUpperCase()}</Avatar>}
                            label={project.category}
                            clickable
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              
                            }}
                          />
                      </Typography>)
                      })}
                    </Card>
                </Grid>
              </Paper>
            </Grid>
          
          <Grid item xs={3}>
            <Paper className={classes.paper}>news</Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
