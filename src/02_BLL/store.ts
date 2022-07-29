import {TasksActionsType, tasksReducer} from './tasks-reducer';
import {TodolistActionsType, todolistsReducer} from './todolists-reducer';
import {applyMiddleware, combineReducers, legacy_createStore} from 'redux'
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {AppActionsType, appReducer} from './app-reducer'
import {authReducer, LoginActionsType} from "./login-reducer";
import { useDispatch } from 'react-redux';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const useAppDispatch = () => useDispatch<AppDispatch>()

//types
type RootState = ReturnType<typeof store.getState>
type AppDispatch = ThunkDispatch<RootState, unknown, AppReducersTypes>

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppStateType = ReturnType<typeof rootReducer>
export type AppReducersTypes = AppActionsType | TasksActionsType | LoginActionsType | TodolistActionsType
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, AppReducersTypes>

