const express = require('express')

const app = express()
const cors = require('cors')
const { unKnownEndpoint, errorHandler } = require('./middleware/errorhandler')

app.use(cors())
require('express-async-errors')

app.use(express.json())
app.use(express.static('dist'))

app.use('/api/blogs', require('./controllers/blog'))
app.use('/api/users', require('./controllers/user'))
app.use('/api/login', require('./controllers/login'))

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use(unKnownEndpoint)
app.use(errorHandler)

module.exports = app
