const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (password === undefined) {
    res.status(400).json({ error: 'password must be provided' });
  } else if (password.length < 3) {
    res.status(400).json({ error: 'password  must be atleast 3 characters' });
  } else if (username.length < 3) {
    res.status(400).json({ error: 'Username must be atleast 3 characters' });
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    name,
    passwordHash,
  });
  const savedUser = await user.save();

  if (!savedUser) {
    res.status(500).json({ error: 'Failed to create user' });
  }
  res.status(201).json(savedUser);
});

usersRouter.get('/', async (_req, res) => {
  const users = await User.find({}).populate('blogs');
  if (users) {
    res.json(users);
  }
  res.status(404).end();
});

module.exports = usersRouter;
