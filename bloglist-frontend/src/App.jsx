import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    try {
      (async () => {
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      })();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const notifyUser = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const clearLoginForm = () => {
    setPassword('');
    setUserName('');
  };

  const clearBlogForm = () => {
    setTitle('');
    setAuthor('');
    setUrl('');
  };
  const handleLogin = (e) => {
    e.preventDefault();
    loginService
      .login({ username, password })
      .then((user) => {
        setUser(user);
        clearLoginForm();
        window.localStorage.setItem('user', JSON.stringify(user));
        blogService.setToken(user.token);
      })
      .catch((err) => notifyUser('Wrong username or password!', 'error'));
  };

  const handleLogOut = () => {
    const ok = window.confirm('Are you want to logout?');
    if (ok) {
      window.localStorage.clear();
    } else return;
  };

  const addBlog = (e) => {
    e.preventDefault();
    const blog = {
      title,
      author,
      url,
    };

    try {
      (async () => {
        const res = await blogService.create(blog);
        setBlogs(blogs.concat(res));
        clearBlogForm('');
        notifyUser(`${res.title} added by ${user.name}`, 'success');
      })();
    } catch (error) {
      setMessage({ message: error.message, type: 'error' });
    }
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUserName(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    );
  };

  const createBlog = () => {
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
    );
  };
  return (
    <div>
      <Notification message={message} />
      {!user && loginForm()}
      {user && (
        <div>
          <p>Bienvenido {user.username}!</p>
          <button onClick={handleLogOut}>Logout</button>
          {createBlog()}
          <h2>blogs</h2>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
