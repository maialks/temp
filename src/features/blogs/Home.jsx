import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Pagination from '../../components/Pagination'
import Notification from '../notification/Notification'
import Title from '../../components/Title'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './/blogsSlice'

export default function Homepage() {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs.value)
  const notification = useSelector((state) => state.notification)
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  return (
    <div id='main' className='h-full bg-background'>
      <Navbar />
      {notification.visible && (
        <Notification
          title={notification.title}
          message={notification.message}
          type={notification.type}
        />
      )}
      <Title>
        the
        <br />
        bloglist
      </Title>
      <Pagination items={blogs} />
    </div>
  )
}
