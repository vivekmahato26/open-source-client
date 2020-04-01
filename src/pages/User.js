import React,{useState} from 'react';
import Profile from '../components/Profile/Profile';
import ProfileCard from '../components/Profile/ProfileCard';

export default function User(props) {
  const [user, setUser] = useState({
    user: {}
  });
  
  const userId = localStorage.getItem("userId");

  const fetchUser = () => {
    const requestBody = {
      query: `
          query {
            user(userId:"${userId}") {
              _id
              sname
              name
              bio
              social
              owned{
                _id
              }
            }
          }
        `
    };

    fetch(" https://open-source-server.herokuapp.com/graphql", {
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
        let user = resData.data.user;
        console.log(user);
        let social = user.social;
        user.social = [];
        social.forEach(element => {
          let temp = element.split(" ");
          let key = temp[0];
          let value = temp[1];
          user.social[key] = value;
        });
        console.log(user);
        setUser({user});
      })
      .catch(err => {
        console.log(err);
      });
  };
  if (Object.keys(user.user).length === 0) {
    fetchUser();
  }
  
  let userDetails = user.user; 
  if(props.location) {
    if(props.location.state) {
      userDetails = props.location.state.u;
        let social = userDetails.social;
        userDetails.social = [];
        social.forEach(element => {
          let temp = element.split(" ");
          let key = temp[0];
          let value = temp[1];
          userDetails.social[key] = value;
        });
    }
  }

  console.log(userDetails);
  
  return (
    <>
      {(props.type === 'card') && <ProfileCard user={userDetails} />}
      {(props.type !== 'card') && <Profile user={userDetails} />}
    </>
  )
}
