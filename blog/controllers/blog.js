const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../middleware/middleware');

/* const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
}; */

router.get('/', async (_req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', {
    username: 1,
    name: 1,
  });
  if (!blog) {
    res.sendStatus(404).end();
  } else {
    res.json(blog);
  }
});

router.post('/', middleware.tokenExtractor, async (req, res) => {
  const body = req.body;
  const { title, author, url, likes } = body;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);

  if (!title || !url) {
    res.status(400).end();
  } else {
    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id,
    });
    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    res.status(201).json(result);
  }
});

router.delete('/:id', middleware.tokenExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  console.log(blog.user._id.toString());
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);
  console.log(user._id.toString());

  if (user._id.toString() === blog.user._id.toString()) {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
});

router.put('/:id', middleware.tokenExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body;
  const updatedBlog = {
    title,
    author,
    url,
    likes,
  };
  const blog = await Blog.findById(req.params.id);
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);

  if (user._id.toString() === blog.user._id.toString()) {
    const result = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, {
      new: true,
    });
    res.json(result);
  }
});

module.exports = router;
