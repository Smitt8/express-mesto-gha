const jwt = require('jsonwebtoken');
const { ERR_AUTH } = require('../utils/consts');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    res.status(ERR_AUTH).send({ message: 'Пожалуйста авторизуйтесь.' });
    next(err);
  }

  req.user = payload;
  next();
};

module.exports = auth;
