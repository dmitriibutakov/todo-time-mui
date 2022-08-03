import {TasksActionsType, tasksReducer} from './tasks-reducer';
import {TodolistActionsType, todolistsReducer} from './todolists-reducer';
import {combineReducers} from 'redux'
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {AppActionsType, appReducer} from './app-reducer'
import {AuthActionsType, authReducer} from "./auth-reducer";
import { useDispatch } from 'react-redux';
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

//redux
// export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));

//redux-toolkit
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)})

export const useAppDispatch = () => useDispatch<AppDispatch>()

//types
type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, AppReducersTypes>

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppStateType = ReturnType<typeof rootReducer>
export type AppReducersTypes = AppActionsType | TasksActionsType | AuthActionsType | TodolistActionsType
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, AppReducersTypes>

