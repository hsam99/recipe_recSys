import React, { useState, useEffect } from 'react';
import AppTopBar from "../components/AppTopBar";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Tooltip from '@material-ui/core/Tooltip';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';


const useStyles = makeStyles((theme) => ({
    root: {
      overflow: 'hidden',
    },
    container: {
      backgroundColor: 'whitesmoke',
      height: '100%',
      width: '100%',
      marginTop: 35,
      marginBottom: 50
    },
    tile: {
      marginBottom: 15,
    },
    titleBar: {
      backgroundColor: 'rgba(0, 0, 0, 0.35)'
  },
    title: {
      padding: theme.spacing(4, 0, 2, 0),
    },
    overlay : {
      height: '100vh',
    },
    subtitle: {
      paddingBottom: 1 
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 115
  },
  rated_recipes: {
    marginTop: 25
  }
  }));

const SavedRecipePage = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const breakpoint = 960;

    useEffect(() => {
        window.addEventListener("resize", () => setWidth(window.innerWidth));
      }, []);

    useEffect(() => {
        axios.get('/api/view_saved/')
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
            <>
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
          </>
        )
    } else {
      recipes.sort((a, b) => { 
        return -(a.count - b.count);
    })
        return (
            <>
                <AppTopBar />
                <Container fixed className={classes.container}>
                  <Typography variant='h4' className={classes.title}>My Saved Recipes</Typography>
                  <GridList cellHeight={300} cols={width<breakpoint?2:3} spacing={10}>
                    {recipes[0].map((tile) => (
                      <GridListTile className={classes.tile} key={tile.images[0]['id']}>
                        <img src={tile.images[0]['url']} alt={tile.title} />
                        <Link to={`/recipe/${tile.index}/`}>
                        <GridListTileBar
                                title={tile.title}
                            subtitle={<div className={classes.rating}><Rating
                                readOnly="true"
                                size="small"
                                value={tile.avg_rating}
                              /><Box>({tile.rating_count})</Box></div>}
                            actionIcon={tile.count > 3 
                                ?<div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <Tooltip title="Healthier Choice">
                                        <IconButton style={{ color: '#7FFF00' }}>
                                            <CheckCircleOutlineIcon  />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                : ''}
                                classes={{
                                    root: classes.titleBar,
                                    subtitle: classes.subtitle,
                                }}
                            />
                         </Link>
                      </GridListTile>
                    ))}
                  </GridList>
                  <div className={classes.rated_recipes}>
                  <Typography variant='h4' className={classes.title}>My Rated Recipes</Typography>
                  <GridList cellHeight={300} cols={width<breakpoint?2:3} spacing={10}>
                    {recipes[1].map((tile) => (
                      <GridListTile className={classes.tile} key={tile.images[0]['id']}>
                        <img src={tile.images[0]['url']} alt={tile.title} />
                        <Link to={`/recipe/${tile.index}/`}>
                        <GridListTileBar
                                title={tile.title}
                            subtitle={<div className={classes.rating}><Rating
                                readOnly="true"
                                size="small"
                                value={tile.avg_rating}
                              /><Box>({tile.rating_count})</Box></div>}
                            actionIcon={tile.count > 3 
                                ?<div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <Tooltip title="Healthier Choice">
                                        <IconButton style={{ color: '#7FFF00' }}>
                                            <CheckCircleOutlineIcon  />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                : ''}
                                classes={{
                                    root: classes.titleBar,
                                    subtitle: classes.subtitle,
                                }}
                            />
                         </Link>
                      </GridListTile>
                    ))}
                  </GridList>
                  </div>
                </Container>
                {/* <RecipeList searchResult={searchResult} /> */}
            </>
        ) 
    }
};

export default SavedRecipePage;