import {
    addTaskTC,
    fetchTasksTC,
    removeTaskTC,
    tasksReducer,
    TasksStateType,
    updateTaskTC
} from "../../02_BLL/tasks-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../../01_DAL/todolists-api";

const variableTodolistId = "todolistId2"
const taskWithoutId = {
    description: "description",
    title: "title",
    status: TaskStatuses.New,
    priority: TaskPriorities.Low,
    startDate: "startDate",
    deadline: "deadline",
    order: 0,
    addedDate: "addedDate"
}
const startState: TasksStateType = {
    ["todolistId1"]: [
        {
            id: "1", ...taskWithoutId, todoListId: "todolistId1"
        },
        {
            id: "2", ...taskWithoutId, todoListId: "todolistId1"
        },
    ],
    ["todolistId2"]: [
        {
            id: "1", ...taskWithoutId, todoListId: variableTodolistId
        },
        {
            id: "2", ...taskWithoutId, todoListId: variableTodolistId
        }
    ]

}
test('current task should be deleted from current array', () => {
    const action = removeTaskTC.fulfilled({
        taskId: "2",
        todolistId: variableTodolistId
    }, "requestId", {todolistId: variableTodolistId, taskId: "2"})
    const editedState = tasksReducer(startState, action)
    expect(editedState[variableTodolistId].length).toBe(1)
})
test('task should be added to current array', () => {
    const task: TaskType = {
        title: "new title",
        todoListId: variableTodolistId,
        status: TaskStatuses.Completed,
        description: "",
        priority: TaskPriorities.Hi,
        startDate: "",
        deadline: "",
        addedDate: "",
        id: "",
        order: 1
    }
    const action = addTaskTC.fulfilled(task, "requestId", {title: task.title, todolistId: task.todoListId})
    const editedState = tasksReducer(startState, action)
    expect(editedState[variableTodolistId].length).toBe(3)
})
test('current title of task should be changed', () => {
    const newTitle = "new title"
    const updateTask = {taskId: "1", domainModel: {title: newTitle}, todolistId: variableTodolistId}
    const action = updateTaskTC.fulfilled(updateTask, "requestId", updateTask)
    const editedState = tasksReducer(startState, action)
    expect(editedState[variableTodolistId][0].title).toEqual(newTitle)
})
test('tasks should be getted for todolistId', () => {
    const action = fetchTasksTC.fulfilled({
        tasks: [{id: "2", ...taskWithoutId, todoListId: variableTodolistId}],
        todoListId: variableTodolistId
    }, "", variableTodolistId)
    const editedState = tasksReducer(startState, action)
    expect(editedState[variableTodolistId].length).toBe(1)
    expect(editedState[variableTodolistId][0].status).toBe(TaskStatuses.New)
})