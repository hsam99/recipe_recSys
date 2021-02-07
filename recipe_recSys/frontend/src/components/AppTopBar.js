import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/ToolBar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { fade, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TurnedInIcon from '@material-ui/icons/TurnedIn';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import { useHistory } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    appBar: {
        background: 'linear-gradient(to right, #0b5e09, #6dab6c)'
    },
    rightEnd: {
      display: 'flex',
      flexGrow: 0.5,
      justifyContent: 'flex-end',
      marginRight: 0,
    },
    rightEndButtons: {
        justifyContent: 'space-between',
    },
    title: {
        flexGrow: 0.5,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
    },
    form: {
        flexGrow: 5,
    },
    searchBar: {
        position: 'relative',
        display: 'flex',
        flexGrow: 5,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: 'auto',
        [theme.breakpoints.up('xs')]: {
          marginLeft: theme.spacing(2),
          width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '100%',
        },
      },
  }));


const AppTopBar = () => {

    const classes = useStyles();
    const [query, setQuery] = useState('');
    const history = useHistory();

    const handleQueryChange = (e) => {
      setQuery(e.target.value);
    }
    
    const handleSubmit = (e) => {
      e.preventDefault();
      history.push(`/search/${query}/`);
    };

    return (
        <div className={classes.root}>
            <AppBar position="sticky" className={classes.appBar}>
                <ToolBar>
                    <Typography variant="h6" className={classes.title}>HealthyEats</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <FormControl className={classes.searchBar}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput}}
                                value={query}
                                onChange={handleQueryChange}
                                />
                        </FormControl>
                    </form>
                    <div className={classes.rightEnd}>
                        <Tooltip title='Home' arrow>
                            <IconButton color="inherit" href='/'>
                                <HomeIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Saved' arrow>
                            <IconButton color="inherit">
                                <TurnedInIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Logout' arrow>
                            <IconButton color="inherit">
                                <ExitToAppIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </ToolBar>
            </AppBar>
        </div>
    )
}

export default AppTopBar