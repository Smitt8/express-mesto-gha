const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorAuth = require('../utils/ErrorAuth');
const ErrorNotFound = require('../utils/ErrorNotFound');
const ErrorServerError = require('../utils/ErrorServerError');
const checkErr = require('../utils/utils');

const updUserSettings = {
  new: true,
  runValidators: true,
};

const checkExist = (user, res, next) => {
  if (!user) {
    return next(new ErrorNotFound('Пользователь не найден'));
  }
  return res.send(user.toJSON());
};

const getUsers = (req, res, next) => {
  User.find({}).then((users) => {
    res.send(users.map((el) => el));
  }).catch(() => {
    next(new ErrorServerError('Ошибка сервера'));
  });
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id).then((user) => checkExist(user, res, next))
    .catch((err) => next(err));
};

const getMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => checkExist(user, res, next))
    .catch((err) => checkErr(err, next));
};

const createUser = (req, res, next) => {
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
      }).catch((err) => checkErr(err, next));
    })
    .catch(() => next(new ErrorServerError('Ошибка сервера')));
};

const updUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, updUserSettings)
    .then((user) => checkExist(user, res, next))
    .catch((err) => checkErr(err, next));
};

const updAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, updUserSettings)
    .then((user) => checkExist(user, res, next))
    .catch((err) => checkErr(err, next));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return next(new ErrorAuth('Неверный логин или пароль'));
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
          return next(new ErrorAuth('Неверный логин или пароль'));
        })
        .catch(() => next(new ErrorServerError('Ошибка сервера')));
    })
    .catch((err) => checkErr(err, next));
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
