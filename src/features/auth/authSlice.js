import { createSlice } from '@reduxjs/toolkit'
import loginServices from '../../services/loginService'
import { jwtDecode } from 'jwt-decode'
import { showNotification } from '../notification/notificationSlice'

export const authSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    userId: null,
    username: null,
    isLoading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token
      state.userId = action.payload.userId
      state.username = action.payload.username
      state.isLoading = false
    },
    logOut: (state) => {
      state.token = null
      state.userId = null
      state.username = null
      state.isLoading = false
      window.localStorage.removeItem('loggedBlogAppUser')
    },
  },
})

export const { setUser, logOut } = authSlice.actions

export const endSession = () => async (dispatch) => {
  dispatch(logOut())
}

export const loginUser = (data) => async (dispatch) => {
  try {
    const token = await loginServices.login(data)

    const { username, id: userId } = jwtDecode(token)
    dispatch(setUser({ token, username, userId }))
    window.localStorage.setItem('loggedBlogAppUser', token)
    dispatch(
      showNotification({
        title: 'Login Successfully',
        message: `Welcome ${username}, you will be rediceted to the home page in 2s`,
        type: 'success',
        duration: 2000,
      })
    )
    return true
  } catch (err) {
    console.log(err)
    dispatch(
      showNotification({
        title: 'Something Wrong',
        message: `Check your username or password`,
        type: 'error',
        duration: 2000,
      })
    )
    return false
  }
}

export default authSlice.reducer
