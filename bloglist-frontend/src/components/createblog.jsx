import { useState } from 'react'
import PropTypes from 'prop-types'

import blogService from '../services/blogs'

const CreateBlog = ({ user, setBlogs, blogs, notifyUser, blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const clearBlogForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const addBlog = (e) => {
    e.preventDefault()
    const blog = {
      title,
      author,
      url,
    }
    try {
      ;(async () => {
        const res = await blogService.create(blog)
        setBlogs(blogs.concat(res))
        clearBlogForm('')
        notifyUser(`${res.title} added by ${user.name}`, 'success')
        blogFormRef.current.toggleVisibility()
      })()
    } catch (error) {
      notifyUser(error.message, 'error')
    }
  }
  return (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          type='text'
          value={title}
          name='title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type='text'
          value={author}
          name='author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          type='text'
          value={url}
          name='url'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type='submit'>Add</button>
    </form>
  )
}

CreateBlog.prototype = {
  user: PropTypes.object.isRequired,
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  notifyUser: PropTypes.func.isRequired,
  blogFormRef: PropTypes.object.isRequired,
}

export default CreateBlog
