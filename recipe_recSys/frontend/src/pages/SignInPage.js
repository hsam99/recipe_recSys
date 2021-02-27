import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Cookies from "universal-cookie";
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '4px solid #ebe8e1',
    padding: theme.spacing(6),
  },
  alertbox :{
    width: '100%',
    marginTop: 15
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
}));

export default function SignInPage(props) {
  const classes = useStyles();
  const cookies = new Cookies();
  const [redirectToReferrer, setredirectToReferrer] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(false);
  const [flag, setFlag] = useState(true);
  const [helperText, setHelperText] = useState({});
  // console.log(props.location.state.from.pathname)


const alertFunc = () => {
  try{
    if(props.location.state.from.pathname == '/signup/'){
      console.log(2, props.location.state)
      if(props.location.state.fromSignUp){
        setAlert(true)
      }
    }
    const state = props.location;
    if (state.state.from) {
      const stateCopy = { ...state };
      delete stateCopy.from;
      props.history.replace({ state: stateCopy });
    }
  }
  catch{
  }
}

  useEffect(async () => {
    await axios.get('/api/session/')
    .then((response) => {
      alertFunc();
      if (response.data.isAuthenticated){
        setredirectToReferrer(true);
      } else {
        setredirectToReferrer(false);
      }
    }, (error) => {
      console.log(error);
    });
  }, [])
  

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/login/', {
      username: username,
      password: password
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      }
    })
    .then((response) => {
      setredirectToReferrer(true);
      console.log(2,response.data)
    }, (error) => {
      setAlert(false);
      setHelperText(error.response.data);
      console.log(1,error.response.data);
    });
  }

  if (redirectToReferrer === true) {
    return(
      <div>
        <Redirect to={'/'} />
      </div>
    )
  } else {
      return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          {/* <Box className={classes.box}> */}
          <Box className={classes.paper} borderRadius='5%'>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Alert severity="success" className={classes.alertbox} style={{display: alert === true ? 'block': 'none'}}>
              <AlertTitle>Account created!</AlertTitle>
            </Alert>
            <Alert severity="error" className={classes.alertbox} style={{display: 'detail' in helperText === true  ? 'block': 'none'}}>
              <AlertTitle>Wrong username or password.</AlertTitle>
            </Alert>
            <form className={classes.form} onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
                onChange={handleUsernameChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handlePasswordChange}
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container justify='flex-end'>
                {/* <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid> */}
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Box>
          {/* </Box> */}
        </Container>
      );
    }
}