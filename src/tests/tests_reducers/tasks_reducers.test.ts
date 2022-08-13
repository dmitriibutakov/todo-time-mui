import {addTask, removeTask, setTasks, tasksReducer, TasksStateType, updateTask} from "../../02_BLL/tasks-reducer";
import {TaskPriorities, TaskStatuses} from "../../01_DAL/todolists-api";

const variableTodolistId = "todolistId2"
const taskWithoutId = {
    description: "description",
    title: "title",
    status: TaskStatuses.New,
    priority: TaskPriorities.Low,
    startDate: "startDate",
    deadline: "deadline",
    todoListId: variableTodolistId,
    order: 0,
    addedDate: "addedDate"
}
const startState: TasksStateType = {
    ["todolistId1"]: [
        {
            id: "1", ...taskWithoutId
        },
        {
            id: "2", ...taskWithoutId
        },
    ],
    ["todolistId2"]: [
        {
            id: "1", ...taskWithoutId
        },
        {
            id: "2", ...taskWithoutId
        }
    ]

}
test('current task should be deleted from current array', () => {
    const action = removeTask({taskId: "2", todolistId: variableTodolistId})
    const editedState = tasksReducer(startState, action)
    expect(editedState[variableTodolistId].length).toBe(1)
})
test('task should be added to current array', () => {
    const action = addTask({task: {id: "3", ...taskWithoutId}})
    const editedState = tasksReducer(startState, action)
    expect(editedState[variableTodolistId].length).toBe(3)
})
test('current title of task should be changed', () => {
    const newTitle = "new title"
    const action = updateTask({taskId: "1", model: {title: newTitle}, todolistId: variableTodolistId})
    const editedState = tasksReducer(startState, action)
    expect(editedState[variableTodolistId][0].title).toBe(newTitle)
})
test('tasks should be getted for todolistId', () => {
    const action = setTasks({tasks: [{id: "4", ...taskWithoutId}], todolistId: variableTodolistId})
    const editedState = tasksReducer(startState, action)
    expect(editedState[variableTodolistId].length).toBe(1)
    expect(editedState[variableTodolistId][0].status).toBe(TaskStatuses.New)
})