import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {useSelector} from "react-redux";
import {loginTC} from "../02_BLL/login-reducer";
import {AppRootStateType, useAppDispatch} from "../02_BLL/store";
import {Navigate} from "react-router-dom";

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn)
    type FormikErrorType = {
        email?: string
        password?: string
        rememberMe?: boolean
    }
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
               errors.password = "Required 2222"
            } else if (values.password.length < 3) {
                errors.password = "min length 3 symbols"
            }
            return errors
        },
        onSubmit: values => {
            dispatch(loginTC(values.email,values.password, values.rememberMe))
            formik.resetForm()
        },
    })
    if (isLoggedIn) {
        return <Navigate to={"/"}/>
    }
    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField {...formik.getFieldProps("email")}
                                   label="Email"
                                   margin="normal"/>
                        {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
                        <TextField {...formik.getFieldProps("password")}
                                   type="password" label="Password"
                                   margin="normal"/>
                        {formik.touched.password && formik.errors.password && <div>{formik.errors.password}</div>}
                        <FormControlLabel
                            {...formik.getFieldProps("rememberMe")}
                            label={'Remember me'} control={<Checkbox/>}/>
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}