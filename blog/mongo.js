const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const mongoUrl =
  process.env.TEST_MONGO_URI ||
  'mongodb+srv://sergeyvinokov:svMGtRHMceT3Hkih@cluster0.84jeneq.mongodb.net/testblogs?retryWrites=true&w=majority';
mongoose
  .connect(mongoUrl)
  .then(() => console.log('Connected to mongodb successfully'))
  .catch((err) => console.error(err));

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Blog = mongoose.model('testblog', blogSchema);
const blogs = new Blog({
  title: 'Aye mate chilling',
  author: 'Maskim',
  url: 'http:ovchinikov.com',
  likes: 21,
});

blogs.save().then((result) => {
  console.log(result);
  mongoose.connection.close();
});

module.exports = Blog;
