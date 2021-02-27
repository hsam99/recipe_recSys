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
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const useStyles = makeStyles((theme) => ({
    header: {
        paddingBlock: theme.spacing(2),
        marginTop: theme.spacing(1),
    },
    root: {
      display: 'flex',
      justifyContent: 'space-around',
      overflow: 'hidden',
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
    },
    listComponent: {
        marginBottom: 50,
    }
  }));

const formatString = (str, index) => {
    const split_str = str.split(/[:;]/);
    console.log(split_str[2].slice(0))
    return(
        <span>{split_str[0]} <Link to={`/recipe/${index}/`}> {split_str[1]} </Link> {split_str[2]}</span>
    )
}

const RecipeList = (props) => {
    const classes = useStyles();
    const tileData = props.data;
    tileData.recipes.sort((a, b) => { 
        return -(a.count - b.count);
    })
    return(
        <div className={classes.listComponent}>
            <Typography variant="h5" className={classes.header}>{tileData.link===true? formatString(tileData.explanation, tileData.index) : tileData.explanation}</Typography>
            <div className={classes.root}>
                <GridList className={classes.gridList} cols={3.5} cellHeight={300} spacing={5}>
                    {tileData.recipes.map((tile) => (
                        <GridListTile key={tile.images[0]['id']}>
                            <img src={tile.images[0]['url']} alt={tile.title} />
                        <Link to={`/recipe/${tile.index}/`}>
                        <GridListTileBar
                            title={tile.title}
                            subtitle={tile.count > 3 
                                ?<div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', color: '#7FFF00', }}><CheckCircleOutlineIcon fontSize="small" /><span> Healthier Choice</span></div>
                                : ''}
                            classes={{
                                root: classes.titleBar,
                                title: classes.title,
                            }}
                        />
                        </Link>
                        </GridListTile>
                    ))}
                </GridList>
            </div>
        </div>
    )
}

export default RecipeList