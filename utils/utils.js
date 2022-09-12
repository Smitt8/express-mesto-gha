const ErrorAuth = require('./ErrorAuth');
const ErrorBadInputs = require('./ErrorBadInputs');
const ErrorServerError = require('./ErrorServerError');

const checkErr = (err, next) => {
  if ((err.kind === 'ObjectId') || (err.name === 'ValidationError')) {
    return next(new ErrorBadInputs('Некорректный запрос'));
  }
  if (err.code === 11000) {
    return next(new ErrorAuth('Неверный логин или пароль'));
  }
  return next(new ErrorServerError('Ошибка сервера'));
};

module.exports = checkErr;
