import {
    addTodolistTC,
    changeTodolistEntityStatus, changeTodolistFilter, changeTodolistTitleTC, fetchTodolistsTC,
    FilterValuesType, removeTodolistTC, TodolistDomainType,
    todolistsReducer
} from "../../02_BLL/todolists-reducer";
import {RequestStatusType} from "../../02_BLL/app-reducer";

const variableTodolistId = "todolistId2"
const todolistWithoutId = {
    title: "incognito" as string,
    addedDate: "data" as string,
    order: null as unknown as number,
    filter: "all" as FilterValuesType,
    entityStatus: "idle" as RequestStatusType
}
const startState: TodolistDomainType[] = [
    {id: "todolistId1", ...todolistWithoutId},
    {id: "todolistId2", ...todolistWithoutId},

]

test('todolist should be deleted from state', () => {
    const action = removeTodolistTC.fulfilled({id: variableTodolistId}, "", variableTodolistId)
    const editedState = todolistsReducer(startState, action)
    expect(editedState.length).toBe(1)
})
test('todolist should be added to state', () => {
    const todo = {...todolistWithoutId, id: "todolistId3"}
    const action = addTodolistTC.fulfilled({todolist: todo}, "", "new title")
    const editedState = todolistsReducer(startState, action)
    expect(editedState.length).toBe(3)
})
test('todolist title should be changed', () => {
    const newTitle = "new title"
    const action = changeTodolistTitleTC.fulfilled({id: variableTodolistId, title: newTitle},
        "", {id: variableTodolistId, title: newTitle})
    const editedState = todolistsReducer(startState, action)
    expect(editedState[1].title).toBe(newTitle)
})
test('todolist entityStatus should be changed', () => {
    const newStatus = "succeeded"
    const action = changeTodolistEntityStatus({id: variableTodolistId, status: newStatus})
    const editedState = todolistsReducer(startState, action)
    expect(editedState[1].entityStatus).toBe(newStatus)
})
test('todolist filter should be changed', () => {
    const newFilter = "active"
    const action = changeTodolistFilter({id: variableTodolistId, filter: newFilter})
    const editedState = todolistsReducer(startState, action)
    expect(editedState[1].filter).toBe(newFilter)
})
test('todolists should be got', () => {
    const action = fetchTodolistsTC.fulfilled({todolists: [...startState]}, "")
    const editedState = todolistsReducer(startState, action)
    expect(editedState.length).toBe(2)
})