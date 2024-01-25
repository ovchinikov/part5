import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/notification'
import LoginForm from './components/loginform'
import Togglable from './components/togglable'
import CreateBlog from './components/createblog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  const blogFormRef = useRef()

  useEffect(() => {
    try {
      ;(async () => {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      })()
    } catch (error) {
      setMessage(error.message, 'error')
    }
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyUser = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleLogOut = () => {
    const ok = window.confirm('Are you want to logout?')
    if (ok) {
      window.localStorage.clear()
    } else return
  }

  // increase likes

  const increaseLikes = async (blog) => {
    try {
      const newBlog = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
      })
      setBlogs(blogs.map((blog) => (blog.id !== newBlog.id ? blog : newBlog)))
    } catch (error) {
      setMessage(error.message, 'error')
    }
  }

  // delete blog

  const deleteBlog = async (blog) => {
    try {
      const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
      if (ok) {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
      } else return
    } catch (error) {
      setMessage(error.message, 'error')
    }
  }
  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  return (
    <div>
      <Notification message={message} />
      {!user && (
        <Togglable buttonLabel='login'>
          <LoginForm setUser={setUser} notifyUser={notifyUser} />
        </Togglable>
      )}
      {user && (
        <div>
          <p>Bienvenido {user.username}!</p>
          <button onClick={handleLogOut}>Logout</button>
          <Togglable buttonLabel='create' ref={blogFormRef}>
            <CreateBlog
              setBlogs={setBlogs}
              blogs={blogs}
              notifyUser={notifyUser}
              user={user}
              blogFormRef={blogFormRef}
            />
          </Togglable>
          <h2>blogs</h2>
          {sortBlogs(blogs).map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              increaseLikes={() => increaseLikes(blog)}
              deleteBlog={() => deleteBlog(blog)}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
