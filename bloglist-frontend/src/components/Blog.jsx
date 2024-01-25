import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, increaseLikes, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const handleView = () => {
    setVisible(!visible)
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div style={blogStyle}>
      <div className='blog'>
        {blog.title} {blog.author}{' '}
        <button onClick={handleView}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible} key={blog.id} className='showWhenVisible'>
        <p>{blog.author}</p>
        <a href={blog.url}>{blog.url}</a>
        <p>
          likes: {blog.likes}
          <button onClick={increaseLikes}>like</button>
        </p>
        <p>{user.username}</p>
        <button onClick={deleteBlog}>delete</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  setBlog: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
}

export default Blog
