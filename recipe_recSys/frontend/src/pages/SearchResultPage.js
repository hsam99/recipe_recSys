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

const SearchResultComponent = (query) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [searchResult, setResult] = useState([]);

  useEffect(() => {
    if (loading) {
      axios.get(`/api/search/${query}/`)
      .then((response) => {
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
                              subtitle={'4.5 rating'}
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