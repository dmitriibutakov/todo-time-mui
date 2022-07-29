import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from './TodolistsList/TodolistsList'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType, useAppDispatch} from './02_BLL/store'
import {initializeAppTC, InitialStateType, RequestStatusType} from './02_BLL/app-reducer'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Menu} from '@mui/icons-material';
import {ErrorSnackbar} from './03_Common_Components/ErrorSnackbar/ErrorSnackbar'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Login} from "./Login/Login";
import {CircularProgress} from "@mui/material";
import {logoutTC} from "./02_BLL/login-reducer";

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const dispatch = useAppDispatch()
    const {status, initialized} = useSelector<AppRootStateType, InitialStateType>((state) => state.app)
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
        <BrowserRouter>
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Login</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                        <Route path='*' element={<Navigate to={'/404'}/>}/>
                        <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                    </Routes>
                </Container>
            </div>
        </BrowserRouter>
    )
}

export default App
