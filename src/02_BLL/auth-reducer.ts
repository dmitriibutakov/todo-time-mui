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
        setIsLoggedIn(state, action: PayloadAction<{isLoggedIn: boolean}>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const authReducer = slice.reducer

//actions
export const {setIsLoggedIn} = slice.actions
// thunks
export const loginTC = (email: string, password: string, rememberMe: boolean): AppThunk => (dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    authAPI.login({email, password, rememberMe})
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedIn({isLoggedIn: true}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => handleServerNetworkError(error, dispatch))
}
export const logoutTC = ():AppThunk => (dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedIn({isLoggedIn: false}))
                dispatch(setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

//types
export type AuthActionsType = ReturnType <typeof slice.actions.setIsLoggedIn>
