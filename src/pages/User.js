import React,{useState} from 'react';
import Profile from '../components/Profile/Profile';
import ProfileCard from '../components/Profile/ProfileCard';

export default function User(props) {
  const [user, setUser] = useState({
    user: {}
  });
  const [check,setCheck] = useState();
  let userId;
  userId = localStorage.getItem("userId");
  if(props.location && props.location.state) {
    userId = props.location.state.userId;
  }

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
              following {
                _id
                profilePic
                sname
              }
              followers {
                _id
                profilePic
                sname
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
        let social = user.social;
        user.social = [];
        social.forEach(element => {
          let temp = element.split(" ");
          let key = temp[0];
          let value = temp[1];
          user.social[key] = value;
        });
        setUser({user});
      })
      .catch(err => {
        console.log(err);
      });
  };

  if(check !== userId) {
    setCheck(userId);
    fetchUser();
  }

  if (Object.keys(user.user).length === 0) {
    fetchUser();
  }
  
  let userDetails = user.user;

  return (
    <>
      {(props.type === 'card') && <ProfileCard user={userDetails} />}
      {(props.type !== 'card') && <Profile user={userDetails} />}
    </>
  )
}
