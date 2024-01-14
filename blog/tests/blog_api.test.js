const mongoose = require('mongoose');
const superTest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = superTest(app);

// Before each test, we empty the database
beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = {
    title: 'Aye mate chilling',
    author: 'Mister Chilling',
    url: 'https://www.chilling.com',
    likes: 10,
  };
  const blog = new Blog(blogObjects);
  await blog.save();
}, 30000);

describe('get all posts', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-type', /application\/json/);
  }, 15000);

  test('there is a single blog post returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(1);
  }, 15000);

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  }, 15000);
});

describe('add a new blog post', () => {
  test('a valid blog post can be added', async () => {
    const newBlog = {
      title: 'Aye mate chilling',
      url: 'https://www.chilling.com',
      author: 'Mister Chilling',
    };
    const post = await api.post('/api/blogs').send(newBlog);

    expect(post.statusCode).toBe(201);
    expect(post.body.title).toBe('Aye mate chilling');
    expect(post.body.author).toBe('Mister Chilling');
    expect(post.body.url).toBe('https://www.chilling.com');

    const res = await api.get('/api/blogs');
    expect(res.body).toHaveLength(2);
  }, 15000);
});

describe('delete a blog post', () => {
  test('a blog post can be deleted', async () => {
    const newBlog = {
      title: 'Aye mate chilling',
      url: 'https://www.chilling.com',
    };
    await api.post('/api/blogs').send(newBlog);
    const res = await api.get('/api/blogs');
    const id = res.body[0].id;
    await api.delete(`/api/blogs/${id}`).expect(204);
  });
});

describe('update a blog post', () => {
  test('a blog post can be updated', async () => {
    const newBlog = {
      title: 'Aye mate chilling',
      url: 'https://www.chilling.com',
    };
    await api.post('/api/blogs').send(newBlog);
    const res = await api.get('/api/blogs');
    const id = res.body[0].id;
    const updatedBlog = {
      title: 'Aye mate chilling',
      url: 'https://www.chilling.com',
      likes: 10,
    };
    await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(200);
  });
});
afterAll(() => {
  mongoose.connection.close();
});
