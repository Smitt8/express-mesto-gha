const { celebrate, Joi } = require('celebrate');
const express = require('express');
const {
  createUser, getUsers, getUserById, updUser, updAvatar, login, getMe,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { urlRegex } = require('../utils/consts');

const usersRoutes = express.Router();

usersRoutes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegex),
  }),
}), createUser);
usersRoutes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

usersRoutes.use(auth);

usersRoutes.get('/users', getUsers);
usersRoutes.get('/users/me', getMe);
usersRoutes.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), getUserById);

usersRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updUser);
usersRoutes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlRegex),
  }),
}), updAvatar);

module.exports = {
  usersRoutes,
};
