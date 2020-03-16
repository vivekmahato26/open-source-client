import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {AuthContext} from '../context/auth';


export default function Navbar () {
  const auth = useContext(AuthContext);
  const logout = () => {
    auth.logout();
  }
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const handleClick = (args) => {
    switch(args) {
      case 'signin' : {
        localStorage.setItem('userId','manual');
        break
      }
      case 'signup' : {
        localStorage.removeItem('userId');
        break;
      }
      default: {
        localStorage.removeItem('userId');
        break;
      }
    }
  }
    return (
        <nav className="navbar">
        <div className="nav-center">
            <ul className= "nav-links">
                <li>
                    <Link to="/">Home</Link>
                </li>
                {token && <li>
                    <Link to="/profile">Profile</Link>
                </li>}
                <li onClick={logout}>
                    <Link>{(localStorage.getItem('token')) ? 'logout' : ''}</Link>
                </li>
                {!token && <li onclick={handleClick('signin')}>
                    <Link to="/signin">Sign In</Link>
                </li>}
                {!userId &&<li onclick={handleClick('signup')}>
                  <Link to='/signup'>Sign Up</Link>
                </li>}
            </ul>
        </div>
      </nav>
    )
  }

