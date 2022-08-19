import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from './TodolistsList/TodolistsList'
import {useDispatch, useSelector} from 'react-redux'
import {AppDispatch, AppRootStateType} from './02_BLL/store'
import {initializeAppTC, InitialStateType} from './02_BLL/app-reducer'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {ErrorSnackbar} from './03_Common_Components/ErrorSnackbar/ErrorSnackbar'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Login} from "./Login/Login";
import {CircularProgress} from "@mui/material";
import {logoutTC} from "./02_BLL/auth-reducer";

function App() {
    const dispatch = useDispatch<AppDispatch>()
    const {status, initialized} = useSelector<AppRootStateType, InitialStateType>(state => state.app)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])
    const logoutHandler = () => dispatch(logoutTC())
    if (!initialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">
                        </Typography>
                        {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path={'/'} element={<TodolistsList/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                        <Route path='*' element={<Navigate to={'/404'}/>}/>
                    </Routes>
                </Container>
            </div>
    )
}

export default App
