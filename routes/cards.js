const express = require('express');
const {
  getCards, createCard, rmCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const cardsRoutes = express.Router();

cardsRoutes.get('/cards', getCards);
cardsRoutes.post('/cards', createCard);
cardsRoutes.delete('/cards/:id', rmCard);

cardsRoutes.put('/cards/:id/likes', likeCard);
cardsRoutes.delete('/cards/:id/likes', dislikeCard);

module.exports = {
  cardsRoutes,
};
