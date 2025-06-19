import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { LoadingSpinner } from '../../components/utils/Icons'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, likeBlog, removeBlog } from './blogsSlice'
import { showNotification } from '../notification/notificationSlice'

const Button = ({ label, onClick }) => (
  <button
    className='py-1.5 border-b-1 border-white/0 hover:border-secondary cursor-pointer'
    onClick={(e) => {
      e.stopPropagation
      onClick()
    }}
  >
    {label}
  </button>
)

function IndividualBlogPage() {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.auth)
  const blogId = useParams().id
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (blogs.status === 'idle') dispatch(initializeBlogs())
  }, [blogs, dispatch])

  const blog = blogs.value.find((blog) => blog.id === blogId)

  useEffect(() => {
    if (blogs.status === 'succeeded' && !blog) {
      navigate('/')
      dispatch(
        showNotification({
          title: 'Blog Not Found',
          message: "We couldn't find the blog you're looking for ",
          type: 'warning',
        })
      )
    }
  }, [blog, navigate, dispatch])

  if (blogs.status === 'idle' || blogs.status === 'loading')
    return (
      <div className='h-full bg-background text-secondary'>
        <Navbar />
        <LoadingSpinner />
      </div>
    )

  if (!blog) {
    navigate('/')
    return null
  }

  const { title, author, url, likes, publisher } = blog

  const handleDelete = async (id) => {
    dispatch(removeBlog(id))
    navigate('/')
  }

  const getRandomBlogId = () => {
    const index = Math.floor(Math.random() * blogs.value.length)
    if (blogs.value[index].id === blogId) {
      if (index === blogs.value.length - 1) return blogs.value[0].id
      return blogs.value[index + 1].id
    }
    return blogs.value[index].id
  }
  return (
    <div className='h-full bg-background'>
      <Navbar />
      <div className=' w-[80%] lg:w-[min(50%,768px)] h-[65%] md:h-[55%] lg:mx-auto mt-[10vh] lg:mt-[17vh] flex flex-col p-4 relative'>
        <span className='text-secondary text-5xl mb-1'>{title}</span>
        <span className='text-secondary text-md pl-2'>By {author}</span>
        <span className='text-secondary text-md pl-2 pt-4'>
          You can check out this post directly ate he original source by
          clicking the link bellow:
        </span>
        <a
          className='p-2 cursor-pointer text-sec-bg text-lg font-semibold truncate'
          href={url}
        >
          {url}
        </a>
        <span className='text-secondary text-md pl-2 pt-2'>
          This is not the original publishing platform for this blog post. It
          was published here by {publisher ? publisher.name : 'Anonymus User'}
        </span>
        <span className='text-secondary text-md pl-2 pt-2'>
          {likes} people liked this blog
        </span>
        <div className='absolute bottom-0 flex pl-2 w-full lg:justify-end text-secondary gap-3'>
          <Button label={'Like'} onClick={() => dispatch(likeBlog(blogId))} />
          {blogs.value.length > 1 && (
            <Button
              label={'Next'}
              onClick={() => navigate(`/blogs/${getRandomBlogId()}`)}
            />
          )}
          {publisher && publisher.id === user.userId && (
            <Button onClick={() => handleDelete(blogId)} label={'Delete'} />
          )}
        </div>
      </div>
    </div>
  )
}

export default IndividualBlogPage
