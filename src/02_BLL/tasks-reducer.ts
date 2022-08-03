import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '../01_DAL/todolists-api'
import {AppRootStateType, AppThunk} from './store'
import {setAppStatus} from './app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../04_Utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolist, removeTodolist, setTodolists, TodolistActionsType} from "./todolists-reducer";

const initialState: TasksStateType = {}

const findIndex = (state: TaskType[], id: string) => {
    return state.findIndex(tl => tl.id === id)
}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTask(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const indexTask = findIndex(tasks, action.payload.taskId)
            if (indexTask !== -1) {
                tasks.splice(indexTask, 1)
            }
        },
        addTask(state, action: PayloadAction<{ task: TaskType }>) {
            debugger
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTask(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const indexTask = findIndex(tasks, action.payload.taskId)
            if (indexTask !== -1) {
                tasks[indexTask] = {...tasks[indexTask], ...action.payload.model}
            }
        },
        setTasks(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolist, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolist, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(setTodolists, (state, action) => {
            action.payload.todolists.forEach(tl => state[tl.id] = [])
        })
    },
})

export const tasksReducer = slice.reducer

// actions
export const {addTask, updateTask, setTasks, removeTask} = slice.actions

// thunks
export const fetchTasksTC = (todolistId: string): AppThunk => async dispatch => {
    dispatch(setAppStatus({status: 'loading'}))
    const response = await todolistsAPI.getTasks(todolistId)
    try {
        const tasks = response.data.items
        dispatch(setTasks({tasks, todolistId}))
        dispatch(setAppStatus({status: 'succeeded'}))
    } catch (error: any) {
        console.log(error)
    }
}
export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => async dispatch => {
    const response = await todolistsAPI.deleteTask(todolistId, taskId)
    try {
        dispatch(removeTask({taskId, todolistId}))
    } catch (error: any) {
        console.log(error)
    }
}
export const addTaskTC = (title: string, todolistId: string): AppThunk => async dispatch => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const response = await todolistsAPI.createTask(todolistId, title)
        if (response.data.resultCode === 0) {
            console.log(response.data.data.item)
            dispatch(addTask({task: response.data.data.item}))
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(response.data, dispatch);
        }
    } catch (error: any) {
        handleServerNetworkError(error, dispatch)
    }
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
    async (dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            console.warn('task not found in the state')
            return
        }
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        const response = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
        try {
            if (response.data.resultCode === 0) {
                dispatch(updateTask({taskId, model: domainModel, todolistId}))
            } else {
                handleServerAppError(response.data, dispatch);
            }
        } catch (error: any) {
            handleServerNetworkError(error, dispatch);
        }
    }

//types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = { [key: string]: Array<TaskType> }
export type TasksActionsType =
    | ReturnType<typeof removeTask>
    | ReturnType<typeof addTask>
    | ReturnType<typeof updateTask>
    | TodolistActionsType
    | ReturnType<typeof setTasks>
