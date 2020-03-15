import React,{useContext,useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {AuthContext} from '../../context/auth';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {OutlinedInput,InputLabel,FormControl } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  display: {
    display: 'block',
  }
}));

const SignIn = () => {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const [values, setValues] = useState({
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({showPassword: !values.showPassword });
  };

  const handleLogin = event => {
    const formTarget = event.target;
    const requestBody = {
      query: `
      query{
        login(loginInput:{email:"${formTarget.email.value}",password:"${formTarget.password.value}"}){
          userId
          token
        }
      }
      `
    };
    fetch('http://localhost:8000/graphql',{
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type' : 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
      }
        return res.json();
    })
    .then(resData => {
        const data = resData.data.login;
        if(data !== null) {
          localStorage.setItem('userId',data.userId);
          localStorage.setItem('token',data.token);
          auth.login(data.userId,data.token);
        }
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
    event.preventDefault();
  }

  const handleClick = () => {
    localStorage.removeItem('userId');
  }
 
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
           <FormControl className={classes.display} variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type={values.showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" variant="body2" onClick={handleClick}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default SignIn;