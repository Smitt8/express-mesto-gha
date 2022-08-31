const express = require('express');
const {
  createUser, getUsers, getUserById, updUser, updAvatar,
} = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/users', getUsers);
usersRoutes.get('/users/:id', getUserById);
usersRoutes.post('/users', createUser);

usersRoutes.patch('/users/me', updUser);
usersRoutes.patch('/users/me/avatar', updAvatar);

module.exports = {
  usersRoutes,
};
