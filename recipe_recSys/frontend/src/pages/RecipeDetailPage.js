import React, { useEffect, useState } from "react";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import AppTopBar from "../components/AppTopBar";
import Carousel from 'react-material-ui-carousel'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
      overflow: 'hidden',
    },
    container: {
      display: 'flex',
      height: '100%',
      justifyContent: 'flex-start',
      margin: 50,
      backgroundColor: theme.palette.Paper,
      paddingBottom: 25,
    },
    image: {
        width: 350,
        height: 300,
    },
    gridlist: {
        flexGrow: 0.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    content: {
        flexGrow: 5,
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
    },
    test: {
        alignItems: 'center',
        flex: 1,
    }
  }));

const RecipeDetailPage = (props) => {
    
    const classes = useStyles();
    const [detail, setDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const idx = props.match.params.idx;
    console.log(idx)

    useEffect(() => {
        axios.get(`/api/recipe/${idx}/`)
        .then((response) => {
        setDetail(response.data)
        setLoading(false)
        }, (error) => {
        console.log(error);
        });
    }, []);
    
    const images = detail.images;
    const title = detail.title;
    const ingredients = detail.ingredients;
    const instructions = detail.instructions;
    
    console.log(detail);

    if(loading === false){
        return (
            <div>
                <AppTopBar />
                <div className={classes.container}>
                    <GridList cols={1} cellHeight={270} spacing={10} className={classes.gridlist}>
                        {
                            images.map((image) => (
                                <GridListTile>
                                    <img key={image['id']} src={image['url']} alt={title} className={classes.image}/>
                                </GridListTile>))
                        }
                    </GridList>
                    <div className={classes.content}>
                        <Typography variant={'h4'}>{title}</Typography>
                    </div>
                    <div>
                    <p>Rate here</p>
                </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                loading here
            </div>
        )
    }
}

export default RecipeDetailPage