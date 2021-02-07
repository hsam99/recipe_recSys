import React, { useEffect, useState } from "react";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import AppTopBar from "../components/AppTopBar";
import Carousel from 'react-material-ui-carousel'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    root: {
      overflow: 'hidden',
    },
    container: {
      [theme.breakpoints.up('md')]: {
          display: 'flex'
      },
      height: '100%',
      marginTop: 25,
      backgroundColor: '#e3e2e1',
      padding: 20,
      paddingBottom: 5,
      [theme.breakpoints.down('sm')]: {
        height: '100%',
        left: 0,
        top: 0,
        padding: 15,
        marginTop: 25,
      },
    },
    infoSection: {
        marginTop: 50
    },
    image: {
        width: '100%',
        minHeight: 310,
        maxHeight: 345,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            height: '100%',
        },
    },
    gridlist: {
        width: 300,
        height: 375,
        [theme.breakpoints.down('sm')]: {
            width: 'auto',
            height: 'auto'
        },
    },
    content: {
        [theme.breakpoints.up('md')]: {
            paddingLeft: 50,
        },
    },
    title: {
      fontFamily: 'Times New Roman',
      marginBottom: 15,
    },
    overlay : {
      height: '100vh',
    },
    rating: {
        display: 'flex',
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
                <Container fixed>
                <div className={classes.container}>
                    <Carousel className={classes.gridlist} autoPlay={false}>
                        {
                            images.map((image) => (
                                    <img key={image['id']} src={image['url']} alt={title} className={classes.image}/>
                            ))
                        }
                    </Carousel>
                    <div className={classes.content}>
                    <Typography className={classes.title} variant={'h4'}>{title}</Typography>
                    <div className={classes.rating}><Rating name="read-only" value={4} readOnly size="small"/> <Box ml={2}>69 ratings</Box></div>
                    </div>
                </div>
                <Box className={classes.infoSection}>
                    <Typography className={classes.title} variant={'h4'}>Ingredients</Typography>
                </Box>
                </Container>
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