import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { Paper, Card, Button } from '@material-ui/core'
import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded'
import GitHubIcon from '@material-ui/icons/GitHub'
import FacebookIcon from '@material-ui/icons/Facebook'
import TwitterIcon from '@material-ui/icons/Twitter'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import Project from '../project/Project'
import clsx from 'clsx'

import EditProfile from './EditProfile'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 1200,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(3)
  },
  paper: {
    maxWidth: '100%',
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(3)
  },
  fontClass: {
    fontSize: '1rem',
    background: '#f7f7f7',
    padding: 5,
    marginBottom: 8
  },
  social: {
    display: 'flex',
    alignItems: 'center'
  },
  mainWhite: {
    backgroundColor: '#fff'
  },
  justify: {
    justifyContent: 'center',
    display: 'flex'
  },
  title: {
    fontSize: 14,
    display: '-webkit-box',
    alignItems: 'center',
    '& > *': {
      margin: '1px'
    }
  },
  sticky: {
    position: 'sticky',
    top: '13%',
    alignItems: 'center',
    textAlign: 'center'
  }
}))

const anchorStyle = {
  display: 'flex',
  textDecoration: 'none',
  margin: '5px',
  marginLeft: '33%'
}

export default function Profile(props) {
  const classes = useStyles()
  const userDetails = props.user
  const [follow, setFollow] = useState(false)
  let userName = {}
  let social = {
    github: '',
    linkedin: '',
    facebook: '',
    twitter: ''
  }
  if (userDetails.social) {
    social = userDetails.social
  }

  const userId = localStorage.getItem('userId')
  if (!follow) {
    if (userDetails.followers) {
      userDetails.followers.map(uid => {
        if (uid._id === userId) {
          setFollow(() => true)
        }
      })
    }
  }

  for (let [key, value] of Object.entries(social)) {
    let temp = value.split('/')
    let t = temp.pop()
    userName[key] = t
  }

  const token = localStorage.getItem('token')
  const handleFollow = event => {
    const action = event.target.innerText
    let requestBody
    if (action === 'FOLLOW') {
      requestBody = {
        query: `
              mutation {
                followUser(following:"${userDetails._id}"){
                  _id
                  sname
                }
              }
            `
      }
    }
    if (action === 'UNFOLLOW') {
      requestBody = {
        query: `
              mutation {
                unfollowUser(following:"${userDetails._id}"){
                  _id
                  sname
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
        const follow = resData.data.users
        if (action === 'FOLLOW') {
          setFollow(() => true)
        }
        if (action === 'UNFOLLOW') {
          setFollow(() => false)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <>
      <div className={classes.root}>
        <Grid style={{ background: '#e8e8e8' }} container spacing={3}>
          <Grid item xs={3} className="left-section">
            <Card className={classes.sticky}>
              <AccountBoxRoundedIcon fontSize="large" color="primary" />
              <p>{userDetails.name}</p>
              <p>{userDetails.sname}</p>
              <Paper className={classes.fontClass}>{userDetails.bio}</Paper>
              <div>
                <a
                  style={anchorStyle}
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Chip
                    avatar={
                      <Avatar className={classes.mainWhite}>
                        <GitHubIcon color="primary" />
                      </Avatar>
                    }
                    label={userName.github}
                    clickable
                    variant="outlined"
                  />
                </a>

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

                <a
                  style={anchorStyle}
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Chip
                    avatar={
                      <Avatar className={classes.mainWhite}>
                        {' '}
                        <TwitterIcon color="primary" />
                      </Avatar>
                    }
                    label={userName.twitter}
                    clickable
                    variant="outlined"
                  />
                </a>
              </div>
              {userDetails._id === userId && <EditProfile />}
            </Card>
          </Grid>
          <Grid item xs={6} className="middle-section">
            <Project filterProject={{ exec: 'test' }} />
          </Grid>
          <Grid item xs={3} className={clsx(classes.sticky, 'right-section')}>
            <Card className={classes.sticky}>
              {token && userDetails._id !== userId && (
                <Button
                  color="primary"
                  variant={!follow ? 'outlined' : 'contained'}
                  width="contained"
                  onClick={handleFollow}
                >
                  {!follow ? 'Follow' : 'Unfollow'}
                </Button>
              )}
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  )
}
