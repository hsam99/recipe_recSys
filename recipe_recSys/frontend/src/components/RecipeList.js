import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Divider } from "@material-ui/core";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    header: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(1),
    },
    root: {
      display: 'flex',
      justifyContent: 'space-around',
      overflow: 'hidden',
      paddingInline: theme.spacing(2),
      backgroundColor: 'whitesmoke',
    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    title: {
      color: 'white',
    },
    titleBar: {
    }
  }));

const RecipeList = () => {
    const classes = useStyles();
    const tileData = [
        {title: 'Crunchy ', images: 'https://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/42/17/00/Tk9s8CDkRfiDwgxeoFR6_ConsiderationBKExoticfriedrice.jpg'},
    {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'},
    {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'},
    {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'},
    {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'},
    {title: 'Crunchy Potato Onion Bake', images: 'http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'}]
    
    return(
        <div>
            <Typography variant="h5" className={classes.header}>Recipes similar to <a href='/'>LINK</a></Typography>
            <div className={classes.root}>
                <GridList className={classes.gridList} cols={3.5} cellHeight={300} spacing={10}>
                    {tileData.map((tile) => (
                        <GridListTile key={tile.images}>
                            <img src={tile.images} alt={tile.title} />
                        <GridListTileBar
                            title={tile.title}
                            classes={{
                                root: classes.titleBar,
                                title: classes.title,
                            }}
                        />
                        </GridListTile>
                    ))}
                </GridList>
            </div>
        </div>
    )
}

export default RecipeList