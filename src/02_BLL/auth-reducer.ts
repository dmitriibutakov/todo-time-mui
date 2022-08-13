import {setAppStatus} from './app-reducer'
import {authAPI} from "../01_DAL/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../04_Utils/error-utils";
import {AppThunk} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}
const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const authReducer = slice.reducer

//actions
export const {setIsLoggedIn} = slice.actions

// thunks
export const loginTC = (email: string, password: string, rememberMe: boolean): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const response = await authAPI.login({email, password, rememberMe})
        response.data.resultCode === 0 ?
            dispatch(setIsLoggedIn({isLoggedIn: true}))
            : handleServerAppError(response.data, dispatch)
    } catch (error) {
        handleServerNetworkError(error as Error, dispatch)
    }
}
export const logoutTC = (): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const response = await authAPI.logout()
        if (response.data.resultCode === 0) {
            dispatch(setIsLoggedIn({isLoggedIn: false}))
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error as Error, dispatch)
    }
}

//types
export type AuthActionsType = ReturnType<typeof slice.actions.setIsLoggedIn>
