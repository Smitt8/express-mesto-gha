const jwt = require('jsonwebtoken');
const ErrorAuth = require('../utils/ErrorAuth');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new ErrorAuth('Пожалуйста авторизуйтесь.'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
