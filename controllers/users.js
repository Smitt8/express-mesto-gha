const User = require('../models/user');
const {
  ERR_SERVER_ERR, ERR_NOT_FOUND,
} = require('../utils/consts');
const checkErr = require('../utils/utils');

const updUserSettings = {
  new: true,
  runValidators: true,
};

const checkExist = (user, res, msg) => {
  if (!user) {
    return res.status(ERR_NOT_FOUND).send({ message: 'Пользователь не найден' });
  }
  return res.send((msg) || user);
};

const getUsers = (req, res) => {
  User.find({}).then((users) => {
    res.send(users.map((el) => el));
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
  const {
    name, about, avatar, _id,
  } = req.body;
  const user = new User({
    name, about, avatar, _id,
  });

  user.save().then(() => {
    res.send(user);
  }).catch((err) => checkErr(err, res));
};

const updUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, updUserSettings)
    .then((user) => checkExist(user, res))
    .catch((err) => checkErr(err, res));
};

const updAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, updUserSettings)
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
