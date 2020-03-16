import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import { Link } from "react-router-dom";


export default class tags extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    tagArr: []
  };

  componentDidMount() {
    this.fetchProjects();
  }

  handleClick(event) {
    this.props.onTagClick(event.target.innerText);
  }

  fetchProjects = () => {
    const requestBody = {
      query: `
            query {
              projects(projectFilter:{tag:[null],category:null,userId:null}){
                tag
              }
            }
          `
    };

    fetch("https://open-source-server.herokuapp.com/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const projects = resData.data.projects;
        projects.map(tagsA =>
          tagsA.tag.map(t => {
            this.setState(prevState => ({
              tagArr: [...prevState.tagArr, t]
            }));
            return t;
          })
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const sticky = {
      position: "sticky",
      top: "11%"
    };
    const margin = {
      margin: "5px"
    };
    const card = this.state.tagArr.map((t, index) => (
      <Chip
        style={margin}
        component="span"
        key={index}
        avatar={<Avatar>{t[0].toUpperCase()}</Avatar>}
        label={t}
        clickable
        variant="outlined"
        color="primary"
        onClick={this.handleClick.bind(this)}
      />
    ));
    return <Card style={sticky}><h3 style={{marginLeft:"33%",padding:"5px",marginBottom:0}}>Tags</h3>{card}</Card>;
  }
}
