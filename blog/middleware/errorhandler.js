const errorHandler = (err, _req, res, next) => {
  console.log(err.message);
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: err.message });
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token has expired',
    });
  }
  next(err);
};

const unKnownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

module.exports = {
  errorHandler,
  unKnownEndpoint,
};
