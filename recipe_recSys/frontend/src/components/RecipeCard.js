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
  const image = props.image
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={image}
          alt={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
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
