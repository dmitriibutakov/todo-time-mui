import {todolistsAPI, TodolistType} from '../01_DAL/todolists-api'
import {RequestStatusType, setAppStatus} from './app-reducer'
import {AppThunk} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkError} from "../04_Utils/error-utils";

const initialState: Array<TodolistDomainType> = []

const findIndex = (state: Array<TodolistDomainType>, id: string) => {
    return state.findIndex(tl => tl.id === id)
}
const slice = createSlice({
    name: "todolists",
    initialState,
    reducers: {
        removeTodolist(state, action: PayloadAction<{ id: string }>) {
            const index = findIndex(state, action.payload.id)
            if (index !== -1) {
                state.splice(index, 1)
            }
        },
        addTodolist(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitle(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = findIndex(state, action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = findIndex(state, action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = findIndex(state, action.payload.id)
            state[index].entityStatus = action.payload.status
        },
        setTodolists(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }
    }
})

export const {
    removeTodolist,
    addTodolist,
    changeTodolistTitle,
    changeTodolistFilter,
    changeTodolistEntityStatus,
    setTodolists
} = slice.actions

export const todolistsReducer = slice.reducer

// thunks
export const fetchTodolistsTC = (): AppThunk => async dispatch => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const response = await todolistsAPI.getTodolists()
        dispatch(setTodolists({todolists: response.data}))
        dispatch(setAppStatus({status: 'succeeded'}))
    } catch (error) {
        handleServerNetworkError(error as Error, dispatch);
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => async dispatch => {
    dispatch(setAppStatus({status: 'loading'}))
    dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
    await todolistsAPI.deleteTodolist(todolistId)
    try {
        dispatch(removeTodolist({id: todolistId}))
        dispatch(setAppStatus({status: 'succeeded'}))
    } catch (error) {
        handleServerNetworkError(error as Error, dispatch);
    }
}
export const addTodolistTC = (title: string): AppThunk => async dispatch => {
    dispatch(setAppStatus({status: 'loading'}))
    const response = await todolistsAPI.createTodolist(title)
    try {
        dispatch(addTodolist({todolist: response.data.data.item}))
        dispatch(setAppStatus({status: 'succeeded'}))
    } catch (error) {
        handleServerNetworkError(error as Error, dispatch);
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => async dispatch => {
    await todolistsAPI.updateTodolist(id, title)
    try {
        dispatch(changeTodolistTitle({id, title}))
    } catch (error) {
        handleServerNetworkError(error as Error, dispatch);
    }
}

// types
export type TodolistActionsType =
    | ReturnType<typeof slice.actions.addTodolist>
    | ReturnType<typeof slice.actions.changeTodolistEntityStatus>
    | ReturnType<typeof slice.actions.setTodolists>
    | ReturnType<typeof slice.actions.removeTodolist>
    | ReturnType<typeof slice.actions.changeTodolistFilter>
    | ReturnType<typeof slice.actions.changeTodolistTitle>

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
