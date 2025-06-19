import { configureStore } from '@reduxjs/toolkit'
import blogsReducer from '../features/blogs/blogsSlice'
import authReducer from '../features/auth/authSlice'
import notificationReducer from '../features/notification/notificationSlice'

export default configureStore({
  reducer: {
    blogs: blogsReducer,
    auth: authReducer,
    notification: notificationReducer,
  },
})
