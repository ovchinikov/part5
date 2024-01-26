import { useState } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'
import PropTypes from 'prop-types'

const LoginForm = ({ setUser, notifyUser }) => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const clearLoginForm = () => {
    setPassword('')
    setUserName('')
  }

  const handleLogin = (e) => {
    e.preventDefault()
    loginService
      .login({ username, password })
      .then((user) => {
        setUser(user)
        clearLoginForm()
        window.localStorage.setItem('user', JSON.stringify(user))
        blogService.setToken(user.token)
      })
      .catch(() => notifyUser('Wrong username or password!', 'error'))
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          id='username'
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
          id='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit' id='submit-btn'>
        login
      </button>
    </form>
  )
}

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  notifyUser: PropTypes.func.isRequired,
}

export default LoginForm
