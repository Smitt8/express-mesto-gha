const express = require('express');
const {
  getCards, createCard, rmCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');
const { errorHandler } = require('../middlewares/errors');

const cardsRoutes = express.Router();

cardsRoutes.use(auth);

cardsRoutes.get('/cards', getCards);
cardsRoutes.post('/cards', createCard);
cardsRoutes.delete('/cards/:id', rmCard);

cardsRoutes.put('/cards/:id/likes', likeCard);
cardsRoutes.delete('/cards/:id/likes', dislikeCard);

cardsRoutes.use(errorHandler);

module.exports = {
  cardsRoutes,
};
