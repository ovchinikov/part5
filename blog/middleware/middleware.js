const tokenExtractor = (req, res, next) => {
  const bearerHeaders = req.headers['authorization'];

  if (typeof bearerHeaders !== 'undefined') {
    const bearer = bearerHeaders.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { tokenExtractor };
