import {authAPI} from "../01_DAL/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../04_Utils/error-utils";
import {AppThunk} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setIsLoggedIn} from "./auth-reducer";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    initialized: false
}
const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppError(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppInit(state, action: PayloadAction<{ initialized: boolean }>) {
            state.initialized = action.payload.initialized
        }
    }
})

export const appReducer = slice.reducer

// actions
export const {setAppError, setAppStatus, setAppInit} = slice.actions

// thunks
export const initializeAppTC = (): AppThunk => async dispatch => {
    try {
        const response = await authAPI.me()
        dispatch(setAppInit({initialized: true}))
        response.data.resultCode === 0 ?
            dispatch(setIsLoggedIn({isLoggedIn: true}))
            : handleServerAppError(response.data, dispatch)
    } catch (error) {
        handleServerNetworkError(error as Error, dispatch)
    }
}

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    initialized: boolean
}
export type AppActionsType = ReturnType<typeof slice.actions.setAppInit>
    | ReturnType<typeof slice.actions.setAppStatus>
    | ReturnType<typeof slice.actions.setAppError>