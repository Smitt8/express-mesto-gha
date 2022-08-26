const express = require('express');
const { createUser, getUsers, getUserById } = require('../controllers/users');

const routes = express.Router();

routes.get('/users', getUsers);

routes.get('/users:id', getUserById);

routes.post('/users', express.json(), createUser);

module.exports = {
  routes,
};
