import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";


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


  remove_duplicates(array_){
    var ret_array = [];
    for (var a = array_.length - 1; a >= 0; a--) {
        for (var b = array_.length - 1; b >= 0; b--) {
            if(array_[a] === array_[b] && a !== b){
                delete array_[b];
            }
        };
        if(array_[a] !== undefined)
            ret_array.push(array_[a]);
    };
    return ret_array.reverse();
  }

  sortByFrequency(array) {
  var frequency = {};
  var sortAble = [];
  var newArr = [];

  array.forEach(function(value) { 
      if ( value in frequency )
          frequency[value] = frequency[value] + 1;
      else
          frequency[value] = 1;
  });
  

  for(var key in frequency){
      sortAble.push([key, frequency[key]])
  }

  sortAble.sort(function(a, b){
      return b[1] - a[1]
  })

  
  sortAble.forEach(function(obj){
      for(var i=0; i < obj[1]; i++){
          newArr.push(obj[0]);
      }
  })
  return newArr;
  
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

    fetch(" https://open-source-server.herokuapp.com/graphql?records=20", {
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
        let temp = this.state.tagArr;
        projects.map(tagsA =>
          tagsA.tag.map(t => {
            temp.push(t);
            return t;
          })
        );
        temp = this.sortByFrequency(temp);
        temp = this.remove_duplicates(temp);
        temp = temp.slice(0,15);
        this.setState(prevState => ({
          
          tagArr: [...temp]
        }))
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
