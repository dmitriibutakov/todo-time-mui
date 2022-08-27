import {
    TaskPriorities, TaskStatuses,
    TaskType, todolistsAPI, UpdateTaskModelType
} from '../01_DAL/todolists-api'
import {setAppStatus} from './app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../04_Utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolist, removeTodolist, setTodolists} from "./todolists-reducer";
import {AppStateType} from "./store";

const findIndex = (state: TaskType[], id: string) => {
    return state.findIndex(tl => tl.id === id)
}
// thunks
export const fetchTasksTC = createAsyncThunk("tasks/fetchTasks",
    async (todoListId: string, {dispatch}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const response = await todolistsAPI.getTasks(todoListId)
            const tasks = response.data.items
            dispatch(setAppStatus({status: 'succeeded'}))
            return {tasks, todoListId}
        } catch (error) {
            handleServerNetworkError(error as Error, dispatch)
        }
    })

export const removeTaskTC = createAsyncThunk("tasks/removeTask",
    async (payload: { todolistId: string, taskId: string }, {dispatch}) => {
        try {
            await todolistsAPI.deleteTask(payload.todolistId, payload.taskId)
            return payload
        } catch (error) {
            handleServerNetworkError(error as Error, dispatch)
        }
    })
export const addTaskTC = createAsyncThunk("tasks/addTask",
    async (param: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const response = await todolistsAPI.createTask(param.todolistId, param.title)
            if (response.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                return response.data.data.item
            } else {
                handleServerAppError(response.data, dispatch);
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(error as Error, dispatch)
            rejectWithValue(null)
        }
    })
export const updateTaskTC = createAsyncThunk("tasks/updateTask",
    async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string },
           {dispatch, getState, rejectWithValue}) => {
        const state = getState() as AppStateType
        const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
        if (!task) {
            return rejectWithValue('task not found in the state')
        }
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...param.domainModel
        }
        const response = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel)
        try {
            if (response.data.resultCode === 0) {
                return param
            } else {
                handleServerAppError(response.data, dispatch);
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(error as Error, dispatch);
            return rejectWithValue(null)
        }
    })

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {},
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
        builder.addCase(fetchTasksTC.fulfilled, (state, action: any) => {
            state[action.payload.todoListId] = action.payload.tasks
        })
        builder.addCase(removeTaskTC.fulfilled, (state, action: any) => {
            const tasks = state[action.payload.todolistId]
            const indexTask = findIndex(tasks, action.payload.taskId)
            if (indexTask !== -1) {
                tasks.splice(indexTask, 1)
            }
        })
        builder.addCase(addTaskTC.fulfilled, (state, action: any) => {
            state[action.payload.todoListId].unshift(action.payload)
        })
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const indexTask = findIndex(tasks, action.payload.taskId)
            if (indexTask !== -1) {
                tasks[indexTask] = {...tasks[indexTask], ...action.payload.domainModel}
            }
        })
    },
})

export const tasksReducer = slice.reducer

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
