import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateBlog = ({ createBlog }) => {
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
    createBlog({ title, author, url })
    clearBlogForm('')
  }
  return (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          type='text'
          value={title}
          name='title'
          id='title'
          placeholder='title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type='text'
          value={author}
          id='author'
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
          id='url'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type='submit' id='add'>
        Add
      </button>
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
