const User = require('../models/user');
const {
  ERR_BAD_INPUT, OK, ERR_SERVER_ERR, ERR_NOT_FOUND,
} = require('../utils/consts');

const updUserSettings = {
  new: true,
  runValidators: true,
};

const prepareSendUser = (user) => {
  const newUser = {
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    _id: user._id,
  };
  return newUser;
};

const checkErr = (err, res) => {
  if ((err.kind === 'ObjectId') || (err.errors.name && err.errors.name.name === 'ValidatorError')
  || (err.errors.about && err.errors.about.name === 'ValidatorError')
  || (err.errors.avatar && err.errors.avatar.name === 'ValidatorError')) {
    return res.status(ERR_BAD_INPUT).send({ message: 'Некорректный запрос' });
  }
  return res.status(ERR_SERVER_ERR).send({ message: 'Ошибка сервера' });
};

const checkExist = (user, res, msg) => {
  if (!user) {
    return res.status(ERR_NOT_FOUND).send({ message: 'Пользователь не найден' });
  }
  return res.status(OK).send((msg) || user);
};

const getUsers = (req, res) => {
  User.find({}).then((users) => {
    if (users.length === 0) {
      return res.status(ERR_NOT_FOUND).send({ message: 'Пользователей нет' });
    }
    return res.status(OK).send(users.map((el) => prepareSendUser(el)));
  }).catch(() => {
    res.status(ERR_SERVER_ERR).send({ message: 'Ошибка сервера' });
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id).then((user) => checkExist(user, res))
    .catch((err) => checkErr(err, res));
};

const createUser = (req, res) => {
  const user = new User(req.body);

  user.save().then(() => {
    res.status(OK).send(prepareSendUser(user));
  }).catch((err) => checkErr(err, res));
};

const updUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, updUserSettings)
    .then((user) => checkExist(user, res))
    .catch((err) => checkErr(err, res));
};

const updAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, updUserSettings)
    .then((user) => checkExist(user, res))
    .catch((err) => checkErr(err, res));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updUser,
  updAvatar,
};
