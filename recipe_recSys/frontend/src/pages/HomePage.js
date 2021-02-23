import React, { useEffect, useState } from "react";
import LoadingOverlay from 'react-loading-overlay';
import SearchResultPage from "./SearchResultPage";
import RecipeDetailPage from "./RecipeDetailPage";
import AppTopBar from "../components/AppTopBar";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"
import Container from "@material-ui/core/Container"
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
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
  },
  container: {
    backgroundColor: 'whitesmoke',
    height: '100%',
    width: '100%',
    marginTop: 35,
    marginBottom: 50,
    paddingBottom: 25,
    paddingTop: 5,
  },
  tile: {
    marginBottom: 15,
  },
  title: {
    padding: theme.spacing(4, 0, 2, 0),
  },
  overlay : {
    height: '100vh',

  },
  subtitle: {
    paddingBottom: 1 
  }
}));

const HomePage = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState([]);
//     const tileData = [{'explanation':'KariLembu', 'recipes':[
//       {title: 'Crunchy ', images: 'https://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/42/17/00/Tk9s8CDkRfiDwgxeoFR6_ConsiderationBKExoticfriedrice.jpg'},
//   {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'},
//   {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'},
//   {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'},
//   {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'},
//   {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'}]},
//   {'explanation':'KariLembu2', 'recipes':[
//     {title: 'Crunchy ', images: 'https://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/42/17/00/Tk9s8CDkRfiDwgxeoFR6_ConsiderationBKExoticfriedrice.jpg'},
// {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'},
// {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'},
// {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'},
// {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'},
// {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'}]}]

    useEffect(() => {
        axios.get('/api/auto_recommendation/')
        .then((response) => {
            console.log(response.data)
        setRecipes(response.data);
        setLoading(false);
        }, (error) => {
        console.log(error);
        });
      }, []);

      if (loading){
        return (
          <div>
            <AppTopBar />
            <Container fixed >
              <div className={classes.overlay}>
                <LoadingOverlay
                  active={true}
                  spinner
                  text='Loading recipes...'
                  className={classes.overlay}
                  styles={{
                    content: (base) => ({
                      ...base,
                      color: 'black',
                      fontFamily: 'Arial'
                    }),
                    overlay: (base) => ({
                      ...base,
                      background: 'rgba(255, 255, 255, 0.5)'
                    }),
                    spinner: (base) => ({
                      ...base,
                      width: '100px',
                      '& svg circle': {
                        stroke: 'rgba(0, 0, 0, 0.5)'
                      }
                    }),
                    
                  }}
                  >
                </LoadingOverlay>
              </div>
            </Container>
          </div>
        )
    } else {
        return (
          <div>
            <AppTopBar />
              <Container fixed className={classes.container}>
            {recipes.map((tile) => (
              <RecipeList data={tile} />
            ))}
              </Container>
          </div>
        )
    }
}

export default HomePage