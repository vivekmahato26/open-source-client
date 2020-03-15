import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import { Link } from "react-router-dom";
import {Grid} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
  root: {
    minWidth: 275
  },
  underline: {
    width: "100%",
    height: "5px",
    background: "#ababab",
    margin: "1.7rem auto"
  },
  title: {
    fontSize: 14,
    display: "flex",
    alignItems: 'center',
    '& > *': {
      margin: "1px",
    }
  },
  pos: {
    marginBottom: 12
  },
  block: {
    display: "block"
  },
  tags: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: "1px",
    },
  }
});

const rightAligned = {
  float: "right"
};
const anchorStyle = {
  display: "flex",
  textDecoration: "none",
  fontSize: "1rem",
  color: "#2979ff"
};
let filter = "";

export default function Project(props) {
  const [projects, setProjects] = useState({ projects: [] });
  const [length, setLength] = useState({ length: 0 });

  const handleFilter = (event) => {
    fetchProjects(event.target.innerText);
  }

  

  const fetchProjects = (arg) => {
    if(filter !== "") {
      arg = `${filter}`
    }
    if(arg) {
      arg = `"${arg}"`;
    }
    else {
      arg = null;
    }
    const requestBody = {
      query: `
            query {
              projects(projectFilter:{tag:[${arg}],category:${arg}}){
                _id
                name
                desc
                orgination
                slug
                tag
                category
                createdAt
                admin {
                  _id
                  sname
                  email
                }
              }
            }
          `
    };

    fetch("https://open-source-server.herokuapp.com/graphql", {
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

  if (length.length === 0) {
    fetchProjects();
    setLength({ length: Object.keys(projects).length });
  }
  if(filter !== props.filterProject) {
    filter = props.filterProject;
    fetchProjects();
  }

  const classes = useStyles();
  const line = <div className={classes.underline}></div>;

  const projectList = projects.projects;
  let proj = projectList.map(project => {
    const projectId = project._id;
    return (
      <>
        <br />
        <Card
          key={projectId}
          raised= {true}
          className={classes.root}
          variant="outlined"
        >
          <CardContent>
            <Typography component={"span"}
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
                  onClick={handleFilter}
                />
            </Typography>
            {line}
            <Typography className={classes.pos} color="textSecondary">
              <Link to="/profile" style={anchorStyle}>
                {project.admin.sname}
              </Link>
            </Typography>
            <Typography variant="body2" component="p">
              {project.desc}
            </Typography>
            <Grid container spacing={1}>
                <div className={classes.tags}>
            {project.tag.map(t => {
              return (
                <Chip key={t} 
                  avatar={<Avatar>{t[0].toUpperCase()}</Avatar>}
                  label={t}
                  clickable
                  color="primary"
                  onClick={handleFilter}
                />
              )
            })}</div>
            </Grid>
          </CardContent>
          <CardActions className={classes.block}>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon color="secondary" />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            <Button style={rightAligned} size="small">
              Learn More
            </Button>
          </CardActions>
        </Card>
      </>
    );
  });
  if(projectList.length === 0) {
    proj = <>
            <h2>No projects available for selected filters!!!</h2>
            <Button type="button"
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {window.location.reload(true)}}
          >Clear Filters</Button>
          </>
  }
  return <div>{proj}</div>;
}
