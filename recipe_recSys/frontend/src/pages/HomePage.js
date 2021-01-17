import React, { useEffect, useState } from "react";
import RecipeDetailPage from "./RecipeDetailPage";
import AppTopBar from "../components/AppTopBar";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import FormHelperText from "@material-ui/core/FormHelperText"
import Grid from "@material-ui/core/Grid"
import FormControl from "@material-ui/core/FormControl"
import FormControlLabel from "@material-ui/core/FormControlLabel"


const HomePage = () => {
    return (
    <div style={{'background-color': 'lightblue'}}>
        <AppTopBar />

    </div>


    )
}

export default HomePage