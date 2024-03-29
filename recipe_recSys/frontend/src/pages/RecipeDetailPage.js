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
import Cookies from "universal-cookie";
import { IconButton } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import TurnedInIcon from '@material-ui/icons/TurnedIn';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

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
        width: 345,
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
        width: '100%'
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
        alignItems: 'center'
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
        minWidth: 350,
        maxWidth: 500,
        [theme.breakpoints.only('md')]: {
            maxWidth: 400
        },
    },
    dialog: {
        padding: 10,
    },
    saveButton: {
        border: 'none',
        height: 0,
        width: 0,
        marginTop: 10,
        marginLeft: 10,
        
    },
    rowDiv: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    FSA: {
        marginTop: 50,
        maxWidth: 250,
        padding: 15,
        paddingRight: 0,
    },
    aligning: {
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between'
    }
  }));

const cookies = new Cookies();

const RatingDialog = (props) => {
    const { onClose, open, recipe_idx, prev_rating, setDetail } = props;
    const [rating, setRating] = useState(prev_rating);
    const [update, setUpdate] = useState(false);
    const classes = useStyles();

    const handleClose = () => {
      onClose();
    };
  
    const handleRatingSubmit = () => {
        let value;
        value = rating === null?0:rating

        axios.post('/api/rate/', {
            recipe_idx: recipe_idx,
            rating: value,
          }, {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": cookies.get("csrftoken"),
            }
          })
          .then((response) => {
            setUpdate(true);
          }, (error) => {
            console.log(error.response.data);
          });
      
      onClose();
    };

    if (update === true){
        axios.get(`/api/recipe/${recipe_idx}/`)
        .then((response) => {
        setDetail(response.data);
        setUpdate(false);
        }, (error) => {
        console.log(error);
        });
    }

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
                <DialogContentText>Your rating:</DialogContentText>
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

const FSADialog = (props) => {
    const { onClose, open } = props;
    const classes = useStyles();

    const handleClose = () => {
      onClose();
    };

    return (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className={classes.dialog}>
              <DialogTitle id="alert-dialog-title">The Food Standards Agency (FSA) Traffic Light System</DialogTitle>
              <DialogContent>
                  <DialogContentText>
                    The FSA traffic light system is used to determine how healthy a recipe is in terms of <strong>fat</strong>, <strong>salt</strong>, <strong>saturates</strong> and <strong>sugar</strong>
                    . Red indicates the recipe is high 
                    in a nutrient and you should try to cut down, and green means the recipe is low in that nutrient. 
                    The more green labels the healthier is the recipe.
                  </DialogContentText>
                </DialogContent>
                  <DialogActions>
                  <Button onClick={handleClose} color="primary" size="small">
                      Close
                  </Button>
                  </DialogActions>
          </div>
        </Dialog>
      )
}

const RatingInfo = (props) => {
    const { onClose, open } = props;
    const classes = useStyles();

    const handleClose = () => {
      onClose();
    };

    return (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className={classes.dialog}>
              <DialogTitle id="alert-dialog-title">Rate recipes for the system to capture your preference.</DialogTitle>
                  <DialogActions>
                  <Button onClick={handleClose} color="primary" size="small">
                      Close
                  </Button>
                  </DialogActions>
          </div>
        </Dialog>
      )
}

const SaveButton = (props) => {
    const { save_state, recipe_idx, classes } = props;
    const [selected, setSelected] = useState(save_state);

    const handleSelected = () => {
        setSelected(!selected);
        axios.post('/api/save/', {
            recipe_idx: recipe_idx,
            save: selected,
        }, {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": cookies.get("csrftoken"),
            }
          })
        .then((response) => {
            console.log(response.data)
        }, (error) => {
            console.log(error.response.data);
        });
    };
    
    return (
        <Tooltip title='Save' arrow>
        <ToggleButton className={classes.saveButton} selected={selected} onChange={handleSelected}>
            <TurnedInIcon fontSize={"large"} color={selected===true?'primary':'inherit'}/>
        </ToggleButton>
        </Tooltip>
    )
}

const RecipeDetailPage = (props) => {
    
    const classes = useStyles();
    const [detail, setDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [fsaOpen, setFsaOpen] = useState(false);
    const [ratingOpen, setRatingOpen] = useState(false);
    const idx = props.match.params.idx;
    
    const handleFsaOpen = () => {
        setFsaOpen(true);
    };
    
    const handleFsaClose = () => {
        setFsaOpen(false);
    };

    const handleRatingOpen = () => {
        setRatingOpen(true);
    };
    
    const handleRatingClose = () => {
        setRatingOpen(false);
    };

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

    const formatFSALabels = (label) => {
        if(label[0] == 1){
            return 'green';
        }
        else if(label[1] == 1){
            return 'orange';
        }
        else{
            return 'red';
        }
    }
    
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
                        <div className={classes.rowDiv}>
                            <Typography className={classes.title} variant={'h4'}>{title}</Typography>
                            <SaveButton classes={classes} save_state={detail.saved} recipe_idx={idx}/>
                        </div>
                        <div className={classes.rating}>
                            <Rating name="read-only" value={detail.avg_rating} readOnly size="small" precision={0.5}/> 
                            <Box ml={2}>{detail.rating_count} {(detail.rating_count==0||detail.rating_count==1)?'rating':'ratings'}</Box>
                            <Link href='#' onClick={handleOpen}><Box ml={2}>Rate</Box></Link>
                            <Box className={classes.aligning}><IconButton onClick={handleRatingOpen}><HelpOutlineIcon fontSize="small"/></IconButton></Box>
                        </div>
                        <Box border={2} className={classes.FSA}>
                            <Box className={classes.aligning}>
                                <Typography variant="h6">FSA Traffic Light Info</Typography>
                                <IconButton onClick={handleFsaOpen}>
                                    <HelpOutlineIcon fontSize="small"/>
                                </IconButton>
                            </Box>
                            <Table style={{maxWidth: 130, marginTop: 15}} padding='none'>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Fat</TableCell>
                                        <TableCell align="right">
                                            <FiberManualRecordIcon fontSize="small" style={{ color: formatFSALabels(detail.healthiness_label[0]) }} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Salt</TableCell>
                                        <TableCell align="right">
                                            <FiberManualRecordIcon fontSize="small" style={{ color: formatFSALabels(detail.healthiness_label[1]) }} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Saturates</TableCell>
                                        <TableCell align="right">
                                            <FiberManualRecordIcon fontSize="small" style={{ color: formatFSALabels(detail.healthiness_label[2]) }} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Sugar</TableCell>
                                        <TableCell align="right">
                                            <FiberManualRecordIcon fontSize="small" style={{ color: formatFSALabels(detail.healthiness_label[3]) }} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box> 
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
                <RatingDialog open={open} onClose={handleClose} recipe_idx={idx} prev_rating={detail.rating} setDetail={setDetail}/>
                <FSADialog open={fsaOpen} onClose={handleFsaClose}/>
                <RatingInfo open={ratingOpen} onClose={handleRatingClose}/>
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