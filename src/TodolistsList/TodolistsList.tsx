import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {AppRootStateType, useAppDispatch} from '../02_BLL/store'
import {
    addTodolistTC,
    changeTodolistFilter,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType
} from '../02_BLL/todolists-reducer'
import {addTaskTC, removeTaskTC, TasksStateType, updateTaskTC} from '../02_BLL/tasks-reducer'
import {TaskStatuses} from '../01_DAL/todolists-api'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {AddItemForm} from '../03_Common_Components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from "react-router-dom";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = () => {
    const dispatch = useAppDispatch()
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [dispatch])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        dispatch(removeTaskTC({todolistId, taskId}))
    }, [dispatch])

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskTC({title, todolistId}))
    }, [dispatch])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskTC({taskId: id, domainModel: {status}, todolistId}))
    }, [dispatch])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(updateTaskTC({taskId: id, domainModel: {title: newTitle}, todolistId}))
    }, [dispatch])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilter({id: todolistId, filter: value}))
    }, [dispatch])

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC(id))
    }, [dispatch])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodolistTitleTC({id, title}))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }
    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]
                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
