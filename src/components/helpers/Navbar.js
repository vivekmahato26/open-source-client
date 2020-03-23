import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { fade, makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles(theme => ({
  search: {
    position: "relative",
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    borderRadius: 15,
    border: "2px solid #2979ff",
    marginLeft: "30% !important",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "15ch",
      "&:focus": {
        width: "25ch"
      }
    }
  }
}));

export default function Navbar() {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const logout = () => {
    auth.logout();
  };
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const handleClick = args => {
    switch (args) {
      case "signin": {
        localStorage.setItem("userId", "manual");
        break;
      }
      case "signup": {
        localStorage.removeItem("userId");
        break;
      }
      default: {
        localStorage.removeItem("userId");
        break;
      }
    }
  };
  const handleSearch = event => {
    console.log(event.target.value);
  }
  return (
    <nav className="navbar">
      <div className="nav-center">
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={handleSearch}
              />
            </div>
            {token && (
              <>
              <li>
                <a style={{cursor:"pointer"}}>Messages</a>
              </li>
              <li>
                <Link to="">Notifications</Link>
              </li>
              </>
            )}
            <li onClick={logout}>
              <Link to="/">
                {localStorage.getItem("token") ? <ExitToAppIcon /> : ""}
              </Link>
            </li>
            {!token && (
              <li onClick={handleClick("signin")}>
                <Link to="/signin">Sign In</Link>
              </li>
            )}
            {!userId && (
              <li onClick={handleClick("signup")}>
                <Link to="/signup">Sign Up</Link>
              </li>
            )}
        </ul>
      </div>
    </nav>
  );
}
