import React, { useEffect, useState } from "react";
import axios from 'axios';
import RecipeDetailPage from "./RecipeDetailPage";
import AppTopBar from "../components/AppTopBar";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import FormHelperText from "@material-ui/core/FormHelperText"
import Grid from "@material-ui/core/Grid"
import FormControl from "@material-ui/core/FormControl"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import RecipeList from '../components/RecipeList'
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Divider } from "@material-ui/core";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
  }));

const HomePage = () => {
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    const handleQueryChange = (e) => {
      setQuery(e.target.value);
    }
    
    const handleSubmit = (e) => {
      e.preventDefault();
      window.alert(query);
      // setLoading(true);
      axios.post('/api/search/', {
          query: query,
        })
        .then((response) => {
          console.log('done');
          console.log(response);
        }, (error) => {
          console.log(error);
        });
    };
    
    return (
        <div>
            <AppTopBar query={query} handleQueryChange={handleQueryChange} handleSubmit={handleSubmit} />
            <RecipeList />
            <RecipeList />
            <RecipeList />
        </div>
    )
}

export default HomePage