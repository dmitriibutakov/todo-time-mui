import {SetAppErrorActionType, setAppStatus, SetAppStatusActionType} from './app-reducer'
import {authAPI} from "../01_DAL/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../04_Utils/error-utils";
import {AppThunk} from "./store";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: LoginActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

// actions
export const setIsLoggedIn = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (email: string, password: string, rememberMe: boolean): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    authAPI.login({email, password, rememberMe})
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedIn(true))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => handleServerNetworkError(error, dispatch))
}
export const logoutTC = ():AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedIn(false))
                dispatch(setAppStatus('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

//types
export type LoginActionsType = ReturnType<typeof setIsLoggedIn> | SetAppStatusActionType | SetAppErrorActionType
