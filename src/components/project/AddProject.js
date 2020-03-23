import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button,CssBaseline,
  Container } from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import MenuItem from "@material-ui/core/MenuItem";
import categories from "../../data";


const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
    
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 500
  }
}));

export default function AddProject() {
  const classes = useStyles();

  const [category, setCategory] = useState("");

  const handleChangeCategory = event => {
    setCategory(event.target.value);
  };

  let chip = [];
  const handleChange = e => {
    chip = e;
    return 1;
  };


  const addProject = event => {
    event.preventDefault();

    const formTarget = event.target;
    const date = new Date().toISOString();
    let temp = formTarget.name.value;
    temp = temp.split(" ");
    let slug = "";
    temp.map(s => {
      if (slug === "") {
        slug = slug + s;
      } else {
        slug = slug + "-" + s;
      }
      return slug;
    });
    const requestBody = {
      query: `
            mutation{
              addProject(projectInput:{name:"${formTarget.name.value}",desc:"${formTarget.description.value}",git:"${formTarget.git.value}",website:"${formTarget.website.value}",category:"${category}",orgination:"${formTarget.orgination.value}",slug:"${slug}",tag:"${chip}",createdAt:"${date}"}){
                name
                desc
                tag
                orgination
              }
            }
            `
    };
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
        const data = resData.data.addProject;
        if (data !== null) {
          window.location.reload(true);
        }
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  };


  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      
          <div className={classes.paper}>
            <form className={classes.form} noValidate onSubmit={addProject}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Project Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
              <TextField
                id="category"
                select
                label="Category"
                fullWidth
                value={category}
                onChange={handleChangeCategory}
                variant="outlined"
              >
                {categories.categories.map(option => (
                  <MenuItem key={option.index} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                multiline
                name="description"
                label="Description"
                type="description"
                id="description"
                autoComplete="current-description"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="orgination"
                label="Orgination"
                name="orgination"
                autoComplete="orgination"
              />
              <ChipInput
                onChange={chips => handleChange(chips)}
                variant="outlined"
                margin="normal"
                label="Tags"
                id="tags"
                required
                fullWidth
                placeholder="Tags"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                multiline
                name="git"
                label="Github Link"
                type="git"
                id="git"
                autoComplete="current-git"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                multiline
                name="website"
                label="Website"
                type="website"
                id="website"
                autoComplete="current-website"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Add Project
              </Button>
            </form>
          </div>
        
    </Container>
  );
}
