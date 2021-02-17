import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import HomePage from './pages/HomePage';
import SearchResultPage from "./pages/SearchResultPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import SavedRecipePage from './pages/SavedRecipePage';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"
import axios from "axios";


const fakeAuth = {
  isAuthenticated: true,
  authenticate(cb) {
    this.isAuthenticated = true,
    setTimeout(cb, 100)
  },
  signout(cb) {
    this.isAuthenticated = false,
    setTimeout(cb, 100)
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setAuthentication] = useState(false);
  const [flag, setFlag] = useState(false); // ensure authentication is checked before returning redirect 

  useEffect(async () => {
    await axios.get('/api/session/')
    .then((response) => {
      if (response.data.isAuthenticated){
        setAuthentication(true);
        setFlag(true);
      } else {
        setFlag(true);
        setAuthentication(false);
      }
    }, (error) => {
      console.log(error);
    });
  }, [])

  if (flag === true)
    return <Route {...rest} render={(props) => (
          isAuthenticated === true 
          ? <Component {...props} />
          : <Redirect to={{pathname: '/signin', state: {from: props.location}}} /> 
      )} />
  else
    return <div></div>
}

const App = () => {
  
    return (
      <div className="App">
          <Router>
            <Switch>
              <Route path='/signin' component={SignInPage}  />
              <Route path='/signup' component={SignUpPage}  />
              <PrivateRoute path='/' exact component={HomePage}  />
              <PrivateRoute path='/search/:q' component={SearchResultPage}  />
              <PrivateRoute path='/recipe/:idx' component={RecipeDetailPage}  />
              <PrivateRoute path='/saved' component={SavedRecipePage}  />
            </Switch>
          </Router>
      </div>
    );
}

export default App

ReactDOM.render(
    <App />,
    document.getElementById('app')
);