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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LoadingOverlay from 'react-loading-overlay';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

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
    },
    infoSection: {
        [theme.breakpoints.up('md')]: {
            display: 'flex'
        },
        justifyContent: 'space-between',
        marginTop: 40,
        paddingBottom: 100
    },
    subtitle: {
        fontFamily: 'calibri',
        marginBottom: 15,
    },
    ingredients: {
        
    },
    instructions: {
        [theme.breakpoints.down('sm')]: {
            marginTop: 35
        },
    },
    ingredientList: {
        maxWidth: 500,
        [theme.breakpoints.only('md')]: {
            maxWidth: 400
        },
        
    },
    instructionList: {
        maxWidth: 500,
        [theme.breakpoints.only('md')]: {
            maxWidth: 400
        },
    },
    dialog: {
        padding: 10,
    }
  }));

const RatingDialog = (props) => {
    const [rating, setRating] = useState(0);
    const { onClose, open } = props;
    const classes = useStyles();

    const handleClose = () => {
      onClose();
    };
  
    const handleRatingSubmit = () => {
      onClose();
      window.alert(rating)
    };

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
          <div className={classes.dialog}>
      <DialogTitle id="alert-dialog-title">{"Rate this recipe"}</DialogTitle>
      <DialogContent>

        <Rating
          name="simple-controlled"
          size="large"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" size="small">
            Cancel
          </Button>
          <Button color="primary" autoFocus size="small" onClick={handleRatingSubmit}>
            Submit
          </Button>
        </DialogActions>
        </div>
      </Dialog>
    )
}

const RecipeDetailPage = (props) => {
    
    const classes = useStyles();
    const [detail, setDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const idx = props.match.params.idx;
    
    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

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

    if(loading === false){
        return (
            <div>
                <AppTopBar />
                <Container fixed>
                <div className={classes.container}>
                    <Carousel className={classes.gridlist} autoPlay={false} animation={'slide'}>
                        {
                            images.map((image) => (
                                    <img key={image['id']} src={image['url']} alt={title} className={classes.image}/>
                            ))
                        }
                    </Carousel>
                    <div className={classes.content}>
                        <Typography className={classes.title} variant={'h4'}>{title}</Typography>
                        <div className={classes.rating}>
                            <Rating name="read-only" value={4} readOnly size="small"/> 
                            <Box ml={2}>69 ratings</Box>
                            <Link href='#' onClick={handleOpen}><Box ml={2}>Rate</Box></Link>
                        </div> 
                    </div>
                </div>
                <Box className={classes.infoSection}>
                    <div className={classes.ingredients}>
                        <Typography className={classes.subtitle} variant={'h4'}>Ingredients</Typography>
                        <List className={classes.ingredientList}>
                        {
                            ingredients.map((ingredient, idx) => (
                                <ListItem divider style={{paddingLeft:0}} key={idx}>
                                    <ListItemText>{ingredient['text']}</ListItemText>
                                </ListItem>
                            ))
                        }
                        </List>
                    </div>
                    <div className={classes.instructions}>
                        <Typography className={classes.subtitle} variant={'h4'}>Instructions</Typography>
                        <List className={classes.instructionList}>
                        {
                            instructions.map((instruction, idx) => (
                                <div>
                                    <Typography ><Box fontWeight={"fontWeightBold"} mb={-1}>{`STEP ${idx + 1}`}</Box></Typography>
                                    <ListItem style={{paddingLeft:0, marginBottom:10}}>
                                        <ListItemText>{instruction['text']}</ListItemText>
                                    </ListItem>
                                </div>
                            ))
                        }
                        </List>
                    </div>
                </Box>
                </Container>
                <RatingDialog open={open} onClose={handleClose}/>
            </div>
        )
    }
    else {
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
}

export default RecipeDetailPage