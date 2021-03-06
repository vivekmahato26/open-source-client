import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded'
import CommentIcon from '@material-ui/icons/Comment'
import { Link } from 'react-router-dom'
import { Grid, Paper, TextField } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'

const useStyles = makeStyles({
  root: {
    minWidth: 275
  },
  title: {
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      margin: '1px'
    }
  },
  pos: {
    marginBottom: 12
  },
  block: {
    display: 'block',
    padding: '0.5rem'
  },
  comment: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 5,
    paddingLeft: 10,
    background: '#c7c7c7'
  },
  tags: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: '1px'
    }
  },
  paper: {
    background: '#f7f7f7',
    padding: 5,
    marginBottom: 8
  },
  icon: {
    width: 25,
    margin: 5
  }
})

const rightAligned = {
  float: 'right'
}
const anchorStyle = {
  display: 'flex',
  textDecoration: 'none',
  fontSize: '1rem',
  color: '#2979ff'
}

const anchorStyleButton = {
  display: 'flex',
  textDecoration: 'none',
  fontSize: '1rem',
  color: '#3f51b5'
}

export default function Project(props) {
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  const [filterProj, setFilterProj] = useState({
    tag: null,
    category: null
  })
  const [projects, setProjects] = useState([])
  const [length, setLength] = useState({ length: 0 })
  const [activeId, setActiveId] = useState([])
  const [filter, setFilter] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [page, setPage] = useState(0)
  const [prevFilter, setPrevFilter] = useState(null)
  const [comment, setComment] = useState([])

  const handleFilterCategory = event => {
    setPage(0)
    setFilter(true)
    let filterP = {
      tag: null,
      category: event.target.innerText
    }
    setFilterProj(prevState => filterP)
    fetchProjects(null, filterProj.category)
  }
  const handleFilterTag = event => {
    setPage(0)
    setFilter(true)
    let filterP = {
      tag: event.target.innerText,
      category: null
    }
    setFilterProj(prevState => filterP)
    fetchProjects(filterProj.tag, null)
  }

  const handleLike = index => {
    let args
    let placeholder = []
    let tempArr = activeId

    if (activeId[index].liked) {
      args = {
        id: activeId[index].projectId,
        index,
        action: 'dislike'
      }
      handleLikeProject(args)
      tempArr[index].liked = false
      tempArr[index].count = tempArr[index].count - 1
      tempArr[index].userIds.filter(function (params) {
        var id = params._id
        return id !== userId
      })
      setActiveId(prevState => [...placeholder, ...tempArr])
    } else {
      args = {
        id: activeId[index].projectId,
        index,
        action: 'like'
      }
      tempArr[index].liked = true
      tempArr[index].count = tempArr[index].count + 1
      tempArr[index].userIds.push({ _id: userId })
      handleLikeProject(args)
      setActiveId(prevState => [...placeholder, ...tempArr])
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return
    setPage(prevState => prevState + 1)
    setIsFetching(true)
  }

  const fetchProjects = (tag, category) => {
    if (tag) {
      tag = `"${tag}"`
    } else {
      tag = null
    }
    if (category) {
      category = `"${category}"`
    } else {
      category = null
    }
    const requestBody = {
      query: `
            query {
              projects(projectFilter:{tag:[${tag}],category:${category},userId:null}){
                _id
                icon
                name
                desc
                organization{
                  name
                  website
                }
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
                }
                community {
                  github
                  website
                  slack
                  facebook
                  discord
                  twitter
                }
                comments {
                  message
                  user {
                    _id
                    profilePic
                    sname
                  }
                  children {
                    message
                    user {
                      _id
                      profilePic
                      sname
                    }
                  }
                }
              }
            }
          `
    }

    fetch(` https://open-source-server.herokuapp.com/graphql?page=${page}&records=${4}`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      })
      .then(resData => {
        const projectArr = resData.data.projects

        projectArr.map(p => {
          var like = {
            projectId: p._id,
            userId: p.likes
          }
          var ifLiked = false
          like.userId.map(uid => {
            if (uid._id === userId) {
              ifLiked = true
            }
            return uid
          })
          setActiveId(prevState => [
            ...prevState,
            {
              id: activeId.length,
              projectId: like.projectId,
              userIds: like.userId,
              count: p.likes.length,
              liked: ifLiked
            }
          ])
          return p
        })
        if (projectArr.length === 0) {
          setIsFetching(true)
          if (tag || category) {
            if (page !== 0) {
              setIsFetching(true)
              return
            }
            setIsFetching(true)
            setProjects(prevProjects => [...projectArr])
          }
        } else if (tag || category) {
          setIsFetching(false)
          setProjects(prevProjects => [...projectArr])
        } else {
          setIsFetching(false)
          setProjects(prevProjects => [...prevProjects, ...projectArr])
        }
        return
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (!isFetching) return
    if (filter) {
      fetchProjects(filterProj.tag, filterProj.category)
      return
    }
    fetchProjects()
  }, [isFetching])

  const handleLikeProject = args => {
    let requestBody
    if (args.action === 'like') {
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
      }
    }
    if (args.action === 'dislike') {
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
      }
    }

    fetch(' https://open-source-server.herokuapp.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      })
      .then(resData => {
        if (resData.errors) {
          window.location.assign(
            `http://${window.location.hostname}:${window.location.port}/signin`
          )
        } else {
          return resData
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  if (length.length === 0) {
    fetchProjects()
    setLength({ length: 4 })
  }

  if (prevFilter !== props.filterProject.exec) {
    setPage(0)
    if (props.filterProject.tag) {
      setFilter(true)
      let filterP = {
        tag: props.filterProject.tag,
        category: null
      }
      setFilterProj(filterP)
      setIsFetching(true)
      fetchProjects(props.filterProject.tag, null)
    }
    if (props.filterProject.category) {
      setFilter(true)
      let filterP = {
        tag: null,
        category: props.filterProject.category
      }
      setFilterProj(prevState => filterP)
      setIsFetching(true)
      fetchProjects(null, props.filterProject.category)
    }
    setPrevFilter(props.filterProject.exec)
  }

  const handleComment = (event, pid) => {
    const form = event.target
    //event.preventDefault();

    const requestBody = {
      query: `
        mutation{
          postComment(commentInput:{message:"${form.comment.value}",project:"${pid}"}){
            message
            user {
              _id
              profilePic
              sname
            }
          }
        }
      
      `
    }
    fetch(' https://open-source-server.herokuapp.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      })
      .then(resData => {
        if (resData.errors) {
          window.location.assign(
            `http://${window.location.hostname}:${window.location.port}/signin`
          )
        } else {
          return resData
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const classes = useStyles()
  const line = <div className="underline"></div>

  const projectList = projects
  let proj = projectList.map((project, index) => {
    const projectId = project._id
    let userId = project.admin._id

    return (
      <React.Fragment key={projectId}>
        <Card raised={true} className={classes.root} variant="outlined">
          <CardContent>
            <Typography
              component={'span'}
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              <Link
                to={{
                  pathname: `/projects/${project.slug}`,
                  state: {
                    project: { project }
                  }
                }}
                style={anchorStyle}
              >
                <div className="imgContainer">
                  {project.icon && (
                    <img className={classes.icon} src={project.icon} alt="" />
                  )}
                  {project.name}
                </div>
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
              {project.organization !== undefined &&
              project.organization !== null ? (
                project.organization.name
              ) : (
                <Link to={{
                  pathname: `/${project.admin.sname}`,
                  state: {
                     userId
                  }
                }} style={anchorStyle}>
                  {project.admin.sname}
                </Link>
              )}
            </Typography>
            <Typography variant="body2" component="span">
              <Paper className={classes.paper}>{project.desc}</Paper>
            </Typography>
            <Grid container spacing={1}>
              <div className={classes.tags}>
                {project.tag.map(t => {
                  return (
                    <Chip
                      key={t}
                      avatar={<Avatar>{t[0].toUpperCase()}</Avatar>}
                      label={t}
                      clickable
                      color="primary"
                      onClick={handleFilterTag}
                    />
                  )
                })}
              </div>
            </Grid>
          </CardContent>
          <CardActions className={classes.block}>
            <IconButton
              aria-label="Likes"
              onClick={() => {
                handleLike(index)
              }}
            >
              <FavoriteIcon
                color={activeId[index].liked ? 'secondary' : 'disabled'}
              />
              {activeId[index].count !== 0 && (
                <Typography>
                  {activeId[index].count === 1
                    ? `${activeId[index].count} Like`
                    : `${activeId[index].count} Likes`}
                </Typography>
              )}
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            <IconButton
              aria-label="comment-icon"
              onClick={() => {
                setComment(projectId)
                if (comment === projectId) {
                  setComment(null)
                }
              }}
            >
              <CommentIcon
                color={
                  comment === projectId || project.comments.length !== 0
                    ? 'primary'
                    : 'disabled'
                }
              />
            </IconButton>
            <Button
              style={rightAligned}
              size="small"
              variant="outlined"
              color="primary"
            >
              <Link
                to={{
                  pathname: `/projects/${project.slug}`,
                  state: {
                    project: { project }
                  }
                }}
                style={anchorStyleButton}
              >
                Learn More
              </Link>
            </Button>
          </CardActions>
          {comment === projectId && (
            <>
              {project.comments.map(c => {
                userId = c.user._id
                return (
                  <Paper key={c._id}>
                    <div className={classes.comment}>
                      <Link
                        to={{
                          pathname: `/${c.user.sname}`,
                          state: {
                             userId
                          }
                        }}
                      >
                        {c.profilePic ? (
                          <img
                            src={c.user.profilePic}
                            alt=""
                            style={{ marginRight: '5px', height: '24px' }}
                          />
                        ) : (
                          <AccountBoxRoundedIcon
                            color="primary"
                            style={{ marginRight: '5px' }}
                          />
                        )}
                      </Link>

                      {c.message}
                    </div>
                  </Paper>
                )
              })}
              <form
                style={{ margin: '10px' }}
                noValidate
                onSubmit={e => {
                  handleComment(e, projectId)
                }}
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  multiline
                  name="comment"
                  label="Post your comment"
                  type="comment"
                  id="comment"
                />
                <Button
                  style={{ marginBottom: '10px', float: 'right' }}
                  variant="outlined"
                  color="primary"
                  type="submit"
                >
                  Post
                </Button>
              </form>
            </>
          )}
        </Card>
        <br />
      </React.Fragment>
    )
  })
  if (projectList.length === 0) {
    proj = (
      <>
        <h2>No projects available for selected filters!!!</h2>
      </>
    )
  }
  return <div id="project-main">{proj}</div>
}
