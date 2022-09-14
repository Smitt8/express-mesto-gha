const { celebrate, Joi } = require('celebrate');
const express = require('express');
const {
  getCards, createCard, rmCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');
const { urlRegex } = require('../utils/consts');

const cardsRoutes = express.Router();

cardsRoutes.use(auth);

cardsRoutes.get('/cards', getCards);
cardsRoutes.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(urlRegex),
  }),
}), createCard);
cardsRoutes.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), rmCard);

cardsRoutes.put('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), likeCard);
cardsRoutes.delete('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = {
  cardsRoutes,
};
