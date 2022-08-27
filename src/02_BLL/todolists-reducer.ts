import {todolistsAPI, TodolistType} from '../01_DAL/todolists-api'
import {RequestStatusType, setAppStatus} from './app-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkError} from "../04_Utils/error-utils";

const findIndex = (state: Array<TodolistDomainType>, id: string) => {
    return state.findIndex(tl => tl.id === id)
}

// thunks
export const fetchTodolistsTC = createAsyncThunk("todolist/fetchTodolists",
    async (arg, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const response = await todolistsAPI.getTodolists()
            dispatch(setAppStatus({status: 'succeeded'}))
            console.log(response.data)
            return {todolists: response.data}
        } catch (error) {
            handleServerNetworkError(error as Error, dispatch);
            return rejectWithValue(null)
        }
    })
export const removeTodolistTC = createAsyncThunk("todolist/removeTodolist",
    async (todolistId: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
        await todolistsAPI.deleteTodolist(todolistId)
        try {
            dispatch(setAppStatus({status: 'succeeded'}))
            return {id: todolistId}
        } catch (error) {
            handleServerNetworkError(error as Error, dispatch);
            return rejectWithValue(null)
        }
    })
export const addTodolistTC = createAsyncThunk("todolist/addTodolist",
    async (title: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const response = await todolistsAPI.createTodolist(title)
            dispatch(setAppStatus({status: 'succeeded'}))
            return {todolist: response.data.data.item}
        } catch (error) {
            handleServerNetworkError(error as Error, dispatch);
            return rejectWithValue(null)
        }
    })
export const changeTodolistTitleTC = createAsyncThunk("todolist/changeTodolistTitle",
    async (param: { id: string, title: string }, {dispatch, rejectWithValue}) => {
        try {
            await todolistsAPI.updateTodolist(param.id, param.title)
            return param
        } catch (error) {
            handleServerNetworkError(error as Error, dispatch);
            return rejectWithValue(null)
        }
    })

const slice = createSlice({
    name: "todolists",
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = findIndex(state, action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = findIndex(state, action.payload.id)
            state[index].entityStatus = action.payload.status
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map((tl: TodolistType) => ({...tl, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = findIndex(state, action.payload.id)
            if (index !== -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        })
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = findIndex(state, action.payload.id)
            state[index].title = action.payload.title
        })
    }
})

export const {
    changeTodolistFilter,
    changeTodolistEntityStatus,
} = slice.actions

export const todolistsReducer = slice.reducer

// types
export type TodolistActionsType =
    | ReturnType<typeof slice.actions.changeTodolistEntityStatus>
    | ReturnType<typeof slice.actions.changeTodolistFilter>

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
