import React, { useEffect, useState } from "react";
import searchApi from "../hooks/useSearch";
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

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    container: {
      marginTop: 50,
    },
    tile: {
      marginBottom: 20,
    },
  }));

const HomePage = () => {
    const classes = useStyles();
  
    const [searchResult, makeSearch] = searchApi();
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    const handleQueryChange = (e) => {
      setQuery(e.target.value);
    }
    
    const handleSubmit = (e) => {
      e.preventDefault();
      makeSearch(query);
      // setLoading(true);

    };
    
    return (
        <div>
            <AppTopBar query={query} handleQueryChange={handleQueryChange} handleSubmit={handleSubmit} />
            <Container fixed className={classes.container}>
              <GridList cellHeight={220} cols={4} spacing={10}>
                {searchResult.map((tile) => (
                  <GridListTile className={classes.tile} key={tile.images[0]['id']}>
                    <img src={tile.images[0]['url']} alt={tile.title} />
                    <GridListTileBar
                            title={tile.title}
                            classes={{
                                root: classes.titleBar,
                                title: classes.title,
                            }}
                            actionIcon={
                                <IconButton aria-label={`star ${tile.title}`}>
                                    <StarBorderIcon className={classes.title} />
                                </IconButton>
                            }
                        />
                  </GridListTile>
                ))}
              </GridList>
            </Container>
            {/* <RecipeList searchResult={searchResult} /> */}
        </div>
    )
}

export default HomePage