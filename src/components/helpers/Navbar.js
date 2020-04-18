import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/auth'
import { fade, makeStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { FaAlignRight } from 'react-icons/fa'
import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded'

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    borderRadius: 15,
    border: '2px solid #2979ff',
    marginLeft: '30%',
    
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '15ch',
      '&:focus': {
        width: '25ch'
      }
    }
  },
  card: { padding: '10px !Important' }
}))
const searchCss = {
  background: '#e8e8e8',
  marginLeft: '40%',
  width: '350px',
  border: '1px solid #ababab',
  borderRadius: '5px',
  position: 'absolute',
  top: '11%',
  zIndex: '20'
}

const anchorStyle = {
  textDecoration: 'none',
  fontSize: '1rem',
  color: '#2979ff',
  display: 'flex',
  alignItems: 'center'
}

export default function Navbar() {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)
  const auth = useContext(AuthContext)
  const [searchRes, setSearchRes] = useState({
    users: [],
    projects: [],
    issues: []
  })
  const [viewSearch, setViewSearch] = useState(false)
  const logout = () => {
    auth.logout()
  }
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const handleClick = args => {
    switch (args) {
      case 'signin': {
        localStorage.setItem('userId', 'manual')
        break
      }
      case 'signup': {
        localStorage.removeItem('userId')
        break
      }
      default: {
        localStorage.removeItem('userId')
        break
      }
    }
  }
  const handleSearch = event => {
    const filter = event.target.value
    const requestBody = {
      query: `
        query{
          search(filter:"${filter}"){
            users{
              _id
              sname
            }
            projects{
              _id
              name
              slug
            }
            issues{
              _id
              slug
            }
          }
        }
      `
    }
    if (filter.length >= 4) {
      fetch(' https://open-source-server.herokuapp.com/graphql?records=20', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!')
          }
          return res.json()
        })
        .then(resData => {
          const search = resData.data.search
          setViewSearch(true)
          setSearchRes(prevState => search)
          if (
            search.users.length === 0 &&
            search.projects.length === 0 &&
            search.issues.length === 0
          ) {
            setViewSearch(prevState => false)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  const handleClickRes = () => {
    setIsOpen(!isOpen)
    setViewSearch(prevState => false)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  function handleScroll() {
    if (viewSearch) {
      if (document.documentElement.scrollTop === 0) {
        document.getElementById('searchDiv').style.position = 'absolute'
      } else {
        document.getElementById('searchDiv').style.position = 'sticky'
      }
    }
  }
  return (
    <>
      <nav className="navbar">
        <div className="nav-center">
          <div className="nav-header">
            <span className="nav-links">
              <Link to="/">
                {/*add logo for project*/}
                Home
              </Link>
            </span>
            {(!isOpen) &&<button
              type="button"
              className="nav-btn"
              onClick={() => setIsOpen(!isOpen)}
            >
              <FaAlignRight className="nav-icon" />
            </button>}
          </div>

          <ul className={isOpen ? 'nav-links show-nav' : 'nav-links'}>
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
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearch}
              />
            </div>
            {isOpen && <Link to="/" onClick={() => setIsOpen(!isOpen)}>Home</Link>}
            {token && (
              <>
                <li onClick={() => setIsOpen(!isOpen)}>
                  <span>Messages</span>
                </li>
                <li onClick={() => setIsOpen(!isOpen)}>
                  <span>Notifications</span>
                </li>
              </>
            )}
            {token && 
            <li onClick={logout}>
              <Link to="/" onClick={() => setIsOpen(!isOpen)}>
                <ExitToAppIcon />
              </Link>
            </li>}
            {!token && (
              <li onClick={handleClick('signin')}>
                <Link to="/signin" onClick={() => setIsOpen(!isOpen)} >Sign In</Link>
              </li>
            )}
            {!userId && (
              <li onClick={handleClick('signup')}>
                <Link to="/signup" onClick={() => setIsOpen(!isOpen)}>Sign Up</Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
      {viewSearch && (
        <div id="searchDiv" style={searchCss}>
          <Card>
            <CardContent className={classes.card}>
              {searchRes.users.length !== 0 && (
                <>
                  {searchRes.users.map(u => {
                    let userId = u._id
                    return (
                      <>
                        <Link
                          to={{
                            pathname: `/${u.sname}`,
                            state: {
                              userId
                            }
                          }}
                          style={anchorStyle}
                          onClick={handleClickRes}
                        >
                          <AccountBoxRoundedIcon
                            color="primary"
                            fontSize="large"
                          />
                          : {u.name}
                        </Link>
                      </>
                    )
                  })}
                </>
              )}
              {searchRes.projects.length !== 0 && (
                <>
                  {searchRes.projects.map(project => {
                    let projectId = project._id
                    return (
                      <>
                        <Link
                          to={{
                            pathname: `/projects/${project.slug}`,
                            state: {
                              projectId
                            }
                          }}
                          style={anchorStyle}
                          onClick={handleClickRes}
                        >
                          {project.name}
                        </Link>
                      </>
                    )
                  })}
                </>
              )}
              {searchRes.issues.length !== 0 && (
                <>
                  {searchRes.issues.map(i => {
                    return (
                      <>
                        <Link
                          to={`/${i.slug}`}
                          style={anchorStyle}
                          onClick={handleClickRes}
                        >
                          {i.name}
                        </Link>
                      </>
                    )
                  })}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
