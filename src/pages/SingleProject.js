import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Commit from '../components/Commit/Commit';
import Issue from '../components/Issue/Issue';


export default function SingleProject(props) {
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
