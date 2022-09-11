const Card = require('../models/card');
const {
  ERR_SERVER_ERR, ERR_NOT_FOUND, ERR_BAD_INPUT,
} = require('../utils/consts');
const checkErr = require('../utils/utils');

const updCardSettings = {
  new: true,
};

const checkExist = (card, res) => {
  if (!card) {
    return res.status(ERR_NOT_FOUND).send({ message: 'Карточка не найдена' });
  }
  return res.send(card);
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards.map((el) => el)))
    .catch(() => {
      res.status(ERR_SERVER_ERR).send({ message: 'Ошибка сервера' });
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

const rmCard = (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  Card.findById(id).then((card) => {
    if (!card) {
      return res.status(ERR_NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    const { owner } = card;
    if (owner.equals(_id)) {
      return Card.deleteOne({ _id: id })
        .then(() => res.send({ message: 'Пост удален' }))
        .catch((err) => checkErr(err, res));
    }
    return res.status(ERR_BAD_INPUT).send({ message: 'У Вас нет прав удалить эту карточку' });
  })
    .catch((err) => checkErr(err, res));
};

const likeCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    updCardSettings,
  ).then((card) => checkExist(card, res))
    .catch((err) => checkErr(err, res));
};

const dislikeCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    updCardSettings,
  ).then((card) => checkExist(card, res))
    .catch((err) => checkErr(err, res));
};

module.exports = {
  getCards,
  createCard,
  rmCard,
  likeCard,
  dislikeCard,
};
