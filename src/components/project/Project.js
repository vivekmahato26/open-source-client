import React, { useState,useEffect } from "react";
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
import {Grid , Paper} from '@material-ui/core';
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
  },
  paper: {
    background: "#f7f7f7",
    padding: 5,
    marginBottom: 8
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

const anchorStyleButton = {
  display: "flex",
  textDecoration: "none",
  fontSize: "1rem",
  color: "#3f51b5"
};

export default function Project(props) {

  let liked = false;
  const userId = localStorage.getItem('userId');

  const [projects, setProjects] = useState([]);
  const [length, setLength] = useState({ length: 0 });
  const [activeId,setActiveId] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page,setPage] = useState(0);


  const handleFilterCategory = (event) => {
    fetchProjects(null,event.target.innerText);
  }
  const handleFilterTag = (event) => {
    fetchProjects(event.target.innerText,null);
  }
  
  const handleLike = (index) => {
    let args;
    let placeholder = [];
    let tempArr = activeId;
    
      if(activeId[index].liked) {
        liked = false;
        args = {
          id: activeId[index].projectId,
          index, 
          action: "dislike"
        };
        handleLikeProject(args);
        tempArr[index].liked = false;
        tempArr[index].count = tempArr[index].count - 1;
        tempArr[index].userIds.filter(function (params) {
          var id = params._id;
          return id !== userId
        });
        setActiveId(prevState =>  [...placeholder,...tempArr]);
        
      }
      else {
        args = {
          id: activeId[index].projectId,
          index,
          action: "like"
        };
        tempArr[index].liked = true;
        tempArr[index].count = tempArr[index].count + 1;
        tempArr[index].userIds.push({_id:userId});
        handleLikeProject(args);
        setActiveId(prevState =>  [...placeholder,...tempArr]); 
      }
           
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  function handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    setIsFetching(true);
  }

  const fetchProjects = (tag,category) => {
    if(tag) {
      tag = `"${tag}"`;
    }
    else {
      tag = null;
    }
    if(category) {
      category = `"${category}"`;
    }
    else {
      category = null;
    }
    const requestBody = {
      query: `
            query {
              projects(projectFilter:{tag:[${tag}],category:${category},userId:null}){
                _id
                name
                desc
                orgination
                slug
                tag
                category
                createdAt
                likes {
                  _id
                }
                admin {
                  _id
                  sname
                  email
                }
              }
            }
          `
    };
    

    fetch(` https://open-source-server.herokuapp.com/graphql?page=${page}&records=${4}`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const projectArr = resData.data.projects;
        
          projectArr.map(p => {
            var like = {
              projectId: p._id,
              userId: p.likes
            }
            var ifLiked = false;
            like.userId.map(uid => {
              if(uid._id === userId) {
                ifLiked = true;
              }
            });
            setActiveId(prevState => [...prevState,{
              id:activeId.length,
              projectId: like.projectId,
              userIds: like.userId,
              count: p.likes.length,
              liked: ifLiked
            }]);
          })
          setPage(page+1);
        if(projectArr.length === 0) {
          setIsFetching(true);
        }
        else {
          setIsFetching(false);
          setProjects(prevProjects => ([...prevProjects, ...projectArr]));
          
        }
        
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!isFetching) return;
    fetchProjects();
  }, [isFetching]);

  const handleLikeProject = (args) => {
    let requestBody
    if(args.action === 'like') {
      requestBody = {
        query: `
              mutation {
                addLikes(projectId:"${args.id}"){
                  _id
                  likes {
                    _id
                  }
                }
              }
            `
      };
    }
    if(args.action === "dislike") {
      requestBody = {
        query: `
              mutation {
                dislike(projectId:"${args.id}"){
                  _id
                  likes {
                    _id
                  }
                }
              }
            `
      };
    }
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
        return resData;
      })
      .catch(err => {
        console.log(err);
      });
  }


  
  if (length.length === 0) {
    fetchProjects();
    setLength({length: 4})
  }
  if(props.filterProject) {
    if(props.filterProject.tag) {
      fetchProjects(props.filterProject.tag,null);
    }
    if(props.filterProject.category) {
      fetchProjects(null,props.filterProject.category);
      }
  }

  const classes = useStyles();
  const line = <div className={classes.underline}></div>;

  const projectList = projects;
  let proj = projectList.map((project,index) => {
    const projectId = project._id;
    

    return (
      <React.Fragment  key={projectId}>
        <br />
        <Card
         
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
                  onClick={handleFilterCategory}
                />
            </Typography>
            {line}
            <Typography className={classes.pos} color="textSecondary">
              
                {(project.orgination !== undefined)? project.orgination : <Link to="/profile" style={anchorStyle}>project.admin.sname</Link>}
              
            </Typography>
            <Typography variant="body2" component="span">
              <Paper className={classes.paper}>{project.desc}</Paper>
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
                  onClick={handleFilterTag}
                />
              )
            })}</div>
            </Grid>
          </CardContent>
          <CardActions className={classes.block}>
            <IconButton aria-label="Likes" onClick={() =>{handleLike(index)}} >
              <FavoriteIcon   color={(activeId[index].liked) ?"secondary" : "disabled"} />
              {(activeId[index].count !== 0) && <Typography>{(activeId[index].count === 1) ? `${activeId[index].count} Like`: `${activeId[index].count} Likes`}</Typography>}
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            <Button style={rightAligned} size="small" variant="outlined" color="primary">
            <Link
                to={{
                  pathname: `/projects/${project.slug}`,
                  state: {
                    projectId: { projectId }
                  }
                }}
                style={anchorStyleButton}
              >
                Learn More
              </Link>
            </Button>
          </CardActions>
        </Card>
      </React.Fragment>
    );
  });
  if(projectList.length === 0) {
    proj = <>
            <h2>No projects available for selected filters!!!</h2>
            
          </>
  }
  return <div id="project-main" >{proj}</div>;
}
