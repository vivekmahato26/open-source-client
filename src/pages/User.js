import React,{useState} from 'react';
import Profile from '../components/Profile/Profile';
import ProfileCard from '../components/Profile/ProfileCard';

export default function User(props) {
  let type = null;
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
        const user = resData.data.user;
        let social = user.social;
        user.social = [];
        social.forEach(element => {
          let temp = element.split(" ");
          let key = temp[0];
          let value = temp[1];
          user.social[key] = value;
        });
        setUser({ user });
      })
      .catch(err => {
        console.log(err);
      });
  };
  if (Object.keys(user.user).length === 0) {
    fetchUser();
  }
  
  const userDetails = user.user;
  if(props.type === 'card')
    {
      type = 'card';
    }
  return (
    <>
      {type && <ProfileCard user={userDetails} />}
      {!type && <Profile user={userDetails} />}
    </>
  )
}
