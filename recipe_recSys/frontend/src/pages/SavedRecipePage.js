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

const SavedRecipePage = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState([]);

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
                  <Typography variant='h4' className={classes.title}> {recipes.length} Results</Typography>
                  <GridList cellHeight={300} cols={3} spacing={10}>
                    {recipes.map((tile) => (
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
};

export default SavedRecipePage;