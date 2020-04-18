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
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    marginTop: 10,
  }
}));

export default function AddProject(props) {
  const classes = useStyles();

  const [category, setCategory] = useState("");
  const [img,setImg] = useState();


  const handleChangeCategory = event => {
    setCategory(event.target.value);
  };

  let chip = [];
  const handleChange = e => {
    chip = e;
    return 1;
  };

  const handleUpload = e => {
    var files = e.target.files;
    var file = files[0];
    let reader = new FileReader();

    // Convert the file to base64 text
    //reader.readAsDataURL(file);
    reader.readAsDataURL(file);
    // on reader load somthing...
    reader.onload = () => {
      setImg(reader.result);
      // Make a fileInfo Object
      // let fileInfo = {
      //   name: file.name,
      //   type: file.type,
      //   size: Math.round(file.size / 1000) + " kB",
      //   base64: reader.result,
      //   file: file
      // };
    }; // reader.onload
  };

  const addProject = event => {
    event.preventDefault();

    const formTarget = event.target;
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
              addProject(projectInput:{icon:"${img}",name:"${formTarget.name.value}",desc:"${formTarget.description.value}",category:"${category}",organization:"${formTarget.organization.value}",slug:"${slug}",tag:"${chip}"}){
                name
                desc
                tag
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
    <Container component="main">
      <CssBaseline />
          <div className={classes.paper}>
            <form className={classes.form} noValidate onSubmit={addProject}>
              <div className="imgContainer">
                {img && <img className="image" src={img} alt=""/>}
                <input type="file" id="file" onChange={handleUpload} />
                <label for="file" class="btn">{(img)?"Change Icon":"Add Icon"}</label>
              </div>
              
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
                id="organization"
                label="Organization"
                name="organization"
                autoComplete="organization"
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
