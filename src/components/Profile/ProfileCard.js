import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded';
import GitHubIcon from "@material-ui/icons/GitHub";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import {Grid} from '@material-ui/core';
import {Link} from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    maxWidth: 275,
    marginBottom: 10
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const anchorStyle = {
  textDecoration: "none",
  fontSize: "1rem",
  color: "#000"
}

export default function Profile(props) {
  const classes = useStyles();
  const userDetails = props.user;
  let social = {
    github: '',
    linkedin: '',
    facebook: '',
    twitter: ''
  }
  if(userDetails.social) {
    social = userDetails.social;
  }
  
  return (
    <Card className={classes.root}>
      <CardContent style={{textAlign:"center"}}>
        <Link to={`/${userDetails.sname}`} style={anchorStyle}><AccountBoxRoundedIcon color="primary" fontSize="large" /></Link>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {userDetails.name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {userDetails.sname}
        </Typography>
        <Typography variant="body2" component="p">
          {userDetails.bio}
        </Typography>
        <Grid container spacing={1} style={{justifyContent:'center'}}>
          <Grid item >
            <a href={social.github} target="_blank" rel="noopener noreferrer"><GitHubIcon color="primary" /></a>
          </Grid>
          <Grid item >
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInIcon color="primary" /></a>
          </Grid>
          <Grid item >
            <a href={social.facebook} target="_blank" rel="noopener noreferrer"><FacebookIcon color="primary" /></a>
          </Grid>
          <Grid item >
            <a href={social.twitter} target="_blank" rel="noopener noreferrer"><TwitterIcon color="primary" /></a>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
