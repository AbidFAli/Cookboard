import { AppBar as MuiAppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import * as paths from '../paths';
import { LogoutButton } from './LogoutButton';

const useStyles = makeStyles({
    appBarContent : {
        color: 'white',
        textDecoration: 'none'
    }
})

const links = [
    {name: 'Search', path: paths.PATH_SEARCH}
]

const AppBar = ({clearUser, user}) => {
    const classes = useStyles()

    /*
     *links: array of {
     *    name, 
     *    path
     *}
     */
    const createLinks = () => {
        let content = links.map((link) => {
            return (
            <Link className = {classes.appBarContent} to ={link.path}>
                {link.name}
            </Link>
            )
        })
        return content
    }

    return (
        <MuiAppBar>
            <Toolbar>
                {user ? <LogoutButton clearUser = {clearUser} /> : null }
                {createLinks()}
            </Toolbar>
        </MuiAppBar>
    )
}

export { AppBar };

