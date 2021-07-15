import { AppBar as MuiAppBar, Toolbar } from '@material-ui/core';
import React from 'react';
import { LogoutButton } from './LogoutButton';



const AppBar = ({clearUser, user}) => {
    return (
        <MuiAppBar>
            <Toolbar>
                {user ? <LogoutButton clearUser = {clearUser} /> : null }
            </Toolbar>
        </MuiAppBar>
    )
}

export { AppBar };

