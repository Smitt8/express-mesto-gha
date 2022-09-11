const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERR_SERVER_ERR, ERR_NOT_FOUND, ERR_AUTH,
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

const getMe = (req, res) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => checkExist(user, res))
    .catch((err) => checkErr(err, res));
};

const createUser = (req, res) => {
  const {
    name, about, avatar, _id, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      const user = new User({
        name,
        about,
        avatar,
        _id,
        email,
        password: hashedPassword,
      });

      user.save().then(() => {
        res.send(user);
      }).catch((err) => checkErr(err, res));
    })
    .catch((err) => console.log(err));
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

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(ERR_AUTH).send({ message: 'Неверный логин или пароль' });
      }
      return bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (isValid) {
            const token = jwt.sign(
              { _id: user._id },
              'some-secret-key',
              { expiresIn: '7d' },
            );

            res.cookie('jwt', token, {
              maxAge: 3600000,
              httpOnly: true,
            });

            return res.send(user);
          }
          return res.status(ERR_AUTH).send({ message: 'Неверный логин или пароль' });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => checkErr(err, res));
};

module.exports = {
  getUsers,
  getUserById,
  getMe,
  createUser,
  updUser,
  updAvatar,
  login,
};
