import {setAppStatus} from './app-reducer'
import {authAPI, LoginParamsType} from "../01_DAL/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../04_Utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

// thunks
export const loginTC = createAsyncThunk<undefined, LoginParamsType,
    { rejectValue: { errors: Array<string>, fieldErrors?: Array<string> } }>("auth/login",
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        try {
            const response = await authAPI.login(param)
            if (response.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(response.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue({
                    errors: response.data.messages,
                    fieldErrors: response.data.fieldsErrors
                })
            }
        } catch (error) {
            const err = error as AxiosError
            handleServerNetworkError(err, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({
                errors: [err.message],
                fieldErrors: undefined
            })
        }
    })

export const logoutTC = createAsyncThunk("auth/logout",
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        try {
            const response = await authAPI.logout()
            if (response.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
                return
            } else {
                handleServerAppError(response.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue(null)
            }
        } catch (error) {
            const err = error as AxiosError
            handleServerNetworkError(err, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    })

//slice
const slice = createSlice({
    name: 'auth',
    initialState: {isLoggedIn: false},
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled, (state) => {
            state.isLoggedIn = false
        })
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedIn} = slice.actions
