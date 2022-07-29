import {setAppError, SetAppErrorActionType, setAppStatus, SetAppStatusActionType} from '../02_BLL/app-reducer'
import {ResponseType} from '../01_DAL/todolists-api'
import {Dispatch} from 'redux'

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    if (data.messages.length) {
        dispatch(setAppError(data.messages[0]))
    } else {
        dispatch(setAppError('Some error occurred'))
    }
    dispatch(setAppStatus('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    dispatch(setAppError(error.message ? error.message : 'Some error occurred'))
    dispatch(setAppStatus('failed'))
}
