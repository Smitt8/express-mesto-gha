const { ERR_BAD_INPUT, ERR_SERVER_ERR } = require('./consts');

const checkErr = (err, res) => {
  if ((err.kind === 'ObjectId') || (err.name === 'ValidationError')) {
    return res.status(ERR_BAD_INPUT).send({ message: 'Некорректный запрос' });
  }
  return res.status(ERR_SERVER_ERR).send({ message: 'Ошибка сервера' });
};

module.exports = checkErr;
