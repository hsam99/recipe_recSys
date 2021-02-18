import React, { useEffect, useState } from "react";
import LoadingOverlay from 'react-loading-overlay';
import RecipeCard from "../components/RecipeCard";
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
import { Button, Divider, Icon } from "@material-ui/core";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';


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

const compare = (a, b) => {
  const label_a = a.healthiness_label;
  const label_b = b.healthiness_label;
  let label_a_count = 0;
  let label_b_count = 0;

  for (let i=0; i<label_a.length; i++){
    if (label_a[i][0] == 1){
      label_a_count++;
    }
    if (label_b[i][0] == 1){
      label_b_count++;
    }
  }

  if (label_a_count < label_b_count){
    return 1
  }

  if (label_a_count > label_b_count){
    return -1
  }

  return 0
}

const SearchResultComponent = (query) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [searchResult, setResult] = useState([]);

  useEffect(() => {
    if (loading) {
      axios.get(`/api/search/${query}/`)
      .then((response) => {
        console.log(response.data)
        setLoading(false)
        setResult(response.data)
      }, (error) => {
        console.log(error);
      });
    }
  }, [loading]);

  useEffect(() => {
    setLoading(true);
  }, [query])

    if (loading) {
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
    }
    else {
      searchResult.sort((a, b) => { 
        return -(a.count - b.count);
    })
      return (
          <div>
              <AppTopBar />
              <Container fixed className={classes.container}>
                <Typography variant='h4' className={classes.title}> {searchResult.length} Results</Typography>
                <GridList cellHeight={300} cols={3} spacing={10}>
                  {searchResult.map((tile) => (
                    <GridListTile className={classes.tile} key={tile.images[0]['id']}>
                      <img src={tile.images[0]['url']} alt={tile.title} />
                      <Link to={`/recipe/${tile.index}/`}>
                      <GridListTileBar
                              title={tile.title}
                              subtitle={tile.count > 2 
                              ?<div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', color: '#7FFF00', }}><CheckCircleOutlineIcon fontSize="small" /><span> Healthier Choice</span></div>
                              : ''}
                              classes={{
                                  root: classes.titleBar,
                                  subtitle: classes.subtitle,
                              }}
                              // actionIcon={
                              //     <IconButton aria-label={`star ${tile.title}`}>
                              //         <StarBorderIcon className={classes.title} />
                              //     </IconButton>
                              // }
                          />
                       </Link>
                    </GridListTile>
                  ))}
                </GridList>
              </Container>
              {/* <RecipeList searchResult={searchResult} /> */}
          </div>
      )
    }
}

const SearchResultPage = (props) => {
  
  return(
    <div>
      {props.match.params.q ? SearchResultComponent(props.match.params.q) : <p>fucking error</p>}
    </div>
  )
}

export default SearchResultPage