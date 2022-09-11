const express = require('express');
const {
  createUser, getUsers, getUserById, updUser, updAvatar, login, getMe,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

const usersRoutes = express.Router();

usersRoutes.post('/signup', createUser);
usersRoutes.post('/signin', login);

usersRoutes.use(auth);

usersRoutes.get('/users', getUsers);
usersRoutes.get('/users/me', getMe);
usersRoutes.get('/users/:id', getUserById);

usersRoutes.patch('/users/me', updUser);
usersRoutes.patch('/users/me/avatar', updAvatar);

module.exports = {
  usersRoutes,
};
