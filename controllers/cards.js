const Card = require('../models/card');
const ErrorNotFound = require('../utils/ErrorNotFound');
const ErrorRights = require('../utils/ErrorRights');
const ErrorServerError = require('../utils/ErrorServerError');
const checkErr = require('../utils/utils');

const updCardSettings = {
  new: true,
};

const checkExist = (card, res, next) => {
  if (!card) {
    return next(new ErrorNotFound('Карточка не найдена'));
  }
  return res.send(card);
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards.map((el) => el)))
    .catch(() => {
      next(new ErrorServerError('Ошибка сервера'));
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const card = new Card({ name, link });

  card.owner = req.user._id;
  card.save().then(() => {
    res.send(card);
  }).catch((err) => checkErr(err, res));
};

const rmCard = (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;
  Card.findById(id).then((card) => {
    if (!card) {
      return next(new ErrorNotFound('Карточка не найдена'));
    }
    const { owner } = card;
    if (owner.equals(_id)) {
      return Card.deleteOne({ _id: id })
        .then(() => res.send({ message: 'Пост удален' }))
        .catch((err) => checkErr(err, next));
    }
    return next(new ErrorRights('Недостаточно прав удалить эту карточку'));
  })
    .catch((err) => checkErr(err, next));
};

const likeCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    updCardSettings,
  ).then((card) => checkExist(card, res, next))
    .catch((err) => checkErr(err, next));
};

const dislikeCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    updCardSettings,
  ).then((card) => checkExist(card, res, next))
    .catch((err) => checkErr(err, next));
};

module.exports = {
  getCards,
  createCard,
  rmCard,
  likeCard,
  dislikeCard,
};
