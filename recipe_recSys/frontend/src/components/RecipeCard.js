import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';

const useStyles = makeStyles({
  root: {
    maxWidth: 275,
  },
  media: {
    height: 175,
  },
  cardAction: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 0,
  },
});

const RecipeCard = (props) => {
  const classes = useStyles();
  const title = props.title;
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image='http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picX9CNE2.jpg'
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Crunchy Onion Potato Bake
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardAction}>
        <Tooltip title='Like' arrow>
            <IconButton color="inherit">
                <ThumbUpAltIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title='Dislike' arrow>
            <IconButton color="inherit">
                <ThumbDownAltIcon />
            </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

export default RecipeCard
