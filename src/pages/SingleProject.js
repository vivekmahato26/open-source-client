import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Commit from '../components/Commit/Commit';
import Issue from '../components/Issue/Issue';


const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
export default function SingleProject(props) {
  const classes = useStyles();
  const projectId = props.location.state.projectId.projectId;
  const token = localStorage.getItem("token");
  return (
    <>
    {token && (
      <>
        <Commit projectId={projectId} />
        <Issue projectId={projectId} />
      </>
      )}
      
    </>
  )
}
