import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import './App.css';
import Navbar from './components/helpers/Navbar';
import Home from './pages/Home';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import User from './pages/User';
import Project from './pages/Project';
import SingleProject from './pages/SingleProject';
import Error from './pages/Error';
import AuthContextProvider from './context/auth';
import Messages from "./components/helpers/message";


function App() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  return (
    <React.Fragment>
        <AuthContextProvider>
          <Navbar/>
          <Messages/>
          <Switch>
            {token && <Redirect from='/signin' to='/' exact />}
            {(userId==="manual") &&  <Redirect push to='/signin' exact />}
            <Route exact path='/signin' component={Signin}/>
            <Route exact path='/signup' component={Signup}/>
            <Route exact path='/' component={Home}/>
            <Route exact path='/projects' component={Project}/>
            <Route exact path='/:slug' component={User}/>
            <Route exaxt path='/projects/:slug' component={SingleProject}/>
            <Route component={Error}/>
          </Switch>
        </AuthContextProvider>
    </React.Fragment>
  );
}

export default App;
