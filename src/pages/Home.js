import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";

import Projects from "../components/project/Project";
import AddProject from "../components/project/AddProject";
import ProfileCard from "./User";
import  categories  from "../data";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    maxWidth: 1200,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(3)
  },
  menuItems: {
    '&:hover': {
      color: "#2979ff",
      textDecoration: "underLine"
   },
  }
}));

export default function Home() {
  const classes = useStyles();
  const [filter,setFilter] = useState('');
  const token = localStorage.getItem("token");
  useEffect(() => {
    console.log('filter');
  });
  return (
    <>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              {token && <ProfileCard type={"card"} />}
              <Card>
                <MenuList >
                  {categories.categories.map(c => {
                    return (
                      <MenuItem key={c.index} className={classes.menuItems} onClick={() => setFilter(c.value)}>{c.value}</MenuItem>
                    )
                  })}
                </MenuList>
              </Card>
            </Grid>
            <Grid item xs={6}>
              {token && <AddProject />}
              <Projects filterProject={filter} />
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
}
