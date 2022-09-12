const { ERR_SERVER_ERR } = require('../utils/consts');

const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case 'NotFound':
      res.status(err.statusCode).send({ message: err.message });
      break;
    case 'InternalError':
      res.status(err.statusCode).send({ message: err.message });
      break;
    case 'AuthError':
      res.status(err.statusCode).send({ message: err.message });
      break;
    default:
      res.status(ERR_SERVER_ERR).send({ message: 'Неизвестная ошибка' });
      break;
  }
};

module.exports = {
  errorHandler,
};
