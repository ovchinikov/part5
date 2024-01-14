require('dotenv').config();

const port = process.env.PORT || 3000;
const mongoUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI
    : process.env.TEST_MONGO_URI;

module.exports = {
  port,
  mongoUrl,
};
