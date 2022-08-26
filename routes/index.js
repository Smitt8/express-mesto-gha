const express = require('express');
const {
  createUser, getUsers, getUserById, updUser, updAvatar,
} = require('../controllers/users');
const { getCards, createCard, rmCard } = require('../controllers/cards');

const routes = express.Router();

routes.get('/users', getUsers);
routes.get('/users/:id', getUserById);
routes.post('/users', express.json(), createUser);

routes.patch('/users/me', express.json(), updUser);
routes.patch('/users/me/avatar', express.json(), updAvatar);

routes.get('/cards', getCards);
routes.post('/cards', express.json(), createCard);
routes.delete('/cards/:id', rmCard);

module.exports = {
  routes,
};
