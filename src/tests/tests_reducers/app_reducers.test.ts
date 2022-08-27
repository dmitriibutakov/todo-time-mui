import {
    appReducer,
    initializeAppTC,
    InitialStateType,
    setAppError,
    setAppStatus
} from "../../02_BLL/app-reducer";

const startState: InitialStateType = {
    status: "idle",
    error: null,
    initialized: false
}

test("app error should be filled", () => {
    const action = setAppError({error: "some error"})
    const editedState = appReducer(startState, action)
    expect(startState.error).toBeNull()
    expect(editedState.error).toBe("some error")
})
test("app status should be changed", () => {
    const action = setAppStatus({status: "loading"})
    const editedState = appReducer(startState, action)
    expect(startState.status).toBe("idle")
    expect(editedState.status).toBe("loading")
})
/*
test("app should be initialized", () => {
    const action = initializeAppTC.fulfilled(void,"", void)
    const editedState = appReducer(startState, action)
    expect(startState.initialized).toBeFalsy()
    expect(editedState.initialized).toBeTruthy()
})*/
