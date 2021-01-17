import React from 'react';
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
    searchBar: {
        position: 'relative',
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
        flexGrow: 5,
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
          width: 'auto',
        },
      },
  }));


const AppTopBar = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="sticky" className={classes.appBar}>
                <ToolBar>
                    <Typography variant="h6" className={classes.title}>HealthyEats</Typography>
                    <FormControl className={classes.searchBar}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput}}
                            />
                    </FormControl>
                    <div className={classes.rightEnd}>
                        <Tooltip title='Account' arrow>
                            <IconButton color="inherit">
                                <AccountBoxIcon />
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