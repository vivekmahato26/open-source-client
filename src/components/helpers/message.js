import React from "react";
import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";
import {
  Chip,
  Avatar,
  Grid,
  Paper,
  TextField,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    maxWidth: 1200,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(3)
  },
  messageChip: {
    marginTop: 10,

  }
}));
export default function message() {
  const classes = useStyles;
  //    const userId = localStorage.getItem('userId');
  return (
    <>
      <div className={classes.root}>
        <Paper elevation={1} className={classes.paper}>
              <div className="message-container">
                <h2>Messages</h2>
                <span className="underline"/>
                <Chip className={classes.messageChip}
                  avatar={
                    <Avatar>
                      <AccountBoxRoundedIcon />
                    </Avatar>
                  }
                  label="trial message"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  avatar={
                    <Avatar>
                      <AccountBoxRoundedIcon />
                    </Avatar>
                  }
                  label="trial message"
                  color="primary"
                  variant="outlined"
                />
              </div>
        </Paper>
      </div>
    </>
  );
}
