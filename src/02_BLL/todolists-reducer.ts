import {todolistsAPI, TodolistType} from '../01_DAL/todolists-api'
import {RequestStatusType, setAppStatus} from './app-reducer'
import {AppThunk} from "./store";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]

        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        default:
            return state
    }
}

// actions
export const removeTodolist = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolist = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitle = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilter = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const changeTodolistEntityStatus = (id: string, status: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status
} as const)
export const setTodolists = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)

// thunks
export const fetchTodolistsTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolists(res.data))
            dispatch(setAppStatus('succeeded'))
        })
}
export const removeTodolistTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    dispatch(changeTodolistEntityStatus(todolistId, 'loading'))
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            dispatch(removeTodolist(todolistId))
            dispatch(setAppStatus('succeeded'))
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistsAPI.createTodolist(title)
        .then((res) => {
            dispatch(addTodolist(res.data.data.item))
            dispatch(setAppStatus('succeeded'))
        })
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => (dispatch) =>
    todolistsAPI.updateTodolist(id, title)
        .then((res) => {
            dispatch(changeTodolistTitle(id, title))
        })

// types
export type AddTodolistActionType = ReturnType<typeof addTodolist>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolist>;
export type SetTodolistsActionType = ReturnType<typeof setTodolists>;
export type ChangeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatus>;
export type TodolistActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof changeTodolistFilter>
    | SetTodolistsActionType
    | ChangeTodolistEntityStatusType

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
