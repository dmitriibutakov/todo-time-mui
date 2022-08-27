import {authAPI} from "../01_DAL/todolists-api";
import {handleServerNetworkError} from "../04_Utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setIsLoggedIn} from "./auth-reducer";

export const initializeAppTC = createAsyncThunk("app/initializedApp",
    async (arg, {dispatch, rejectWithValue}) => {
    try {
        const response = await authAPI.me()
        if (response.data.resultCode === 0) {
            dispatch(setIsLoggedIn({isLoggedIn: true}))
        }
    } catch (error) {
        handleServerNetworkError(error as Error, dispatch)
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: "app",
    initialState: {
        status: 'idle',
        error: null,
        initialized: false
    } as InitialStateType,
    reducers: {
        setAppError(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        }
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.initialized = true
        })
    }
})
export const appReducer = slice.reducer

// actions
export const {setAppError, setAppStatus} = slice.actions

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    initialized: boolean
}
export type AppActionsType = ReturnType<typeof slice.actions.setAppStatus>
    | ReturnType<typeof slice.actions.setAppError>