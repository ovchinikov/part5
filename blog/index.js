const app = require('./app');
const mongoose = require('mongoose');
const config = require('./utils/config');

mongoose.set('strictQuery', false);
mongoose.set('bufferTimeoutMS', 30000);

console.log('connecting to', config.mongoUrl);
mongoose
  .connect(config.mongoUrl)
  .then()
  .catch((err) => console.error(err));

app.listen(config.port);
