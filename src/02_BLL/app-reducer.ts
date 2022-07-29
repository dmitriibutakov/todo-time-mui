import {authAPI} from "../01_DAL/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../04_Utils/error-utils";
import {AppThunk} from "./store";
import {setIsLoggedIn} from "./login-reducer";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    initialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/SET-INIT":
            return {...state, initialized: action.initialized}
        default:
            return {...state}
    }
}

// actions
export const setAppError = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppStatus = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppInit = (initialized: boolean) => ({type: 'APP/SET-INIT', initialized} as const)

// thunks
export const initializeAppTC = ():AppThunk => (dispatch) => {
    authAPI.me().then(res => {
        dispatch(setAppInit(true))
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn(true));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    })
        .catch((error) => handleServerNetworkError(error, dispatch))
}
//types
export type SetAppErrorActionType = ReturnType<typeof setAppError>
export type SetAppStatusActionType = ReturnType<typeof setAppStatus>
export type SetAppInitType = ReturnType<typeof setAppInit>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    initialized: boolean
}
export type AppActionsType =
    | SetAppErrorActionType
    | SetAppStatusActionType
    | SetAppInitType
