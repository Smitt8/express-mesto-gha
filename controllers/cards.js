const Card = require('../models/card');
const {
  ERR_BAD_INPUT, OK, ERR_SERVER_ERR, ERR_NOT_FOUND,
} = require('../utils/consts');

const updCardSettings = {
  new: true,
};

const prepareSendCard = (card) => {
  const newCard = {
    likes: card.likes,
    name: card.name,
    link: card.link,
    owner: card.owner,
    createdAt: card.createdAt,
  };
  return newCard;
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        return res
          .status(ERR_BAD_INPUT)
          .send({ message: 'Нет доступных карточек' });
      }
      return res.status(OK).send(cards.map((el) => prepareSendCard(el)));
    })
    .catch(() => {
      res.status(ERR_SERVER_ERR).send({ message: 'Ошибка сервера' });
    });
};

const createCard = (req, res) => {
  const card = new Card(req.body);

  card.owner = req.user._id;
  card.save().then(() => {
    res.status(OK).send(prepareSendCard(card));
  }).catch((err) => {
    if ((err.errors.name && err.errors.name.name === 'ValidatorError')
    || (err.errors.link && err.errors.link.name === 'ValidatorError')) {
      return res.status(ERR_BAD_INPUT).send({ message: 'Некорректный запрос' });
    }
    return res.status(ERR_SERVER_ERR).send({ message: 'Ошибка сервера' });
  });
};

const rmCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndDelete(id).then((card) => {
    if (!card) {
      return res.status(ERR_NOT_FOUND).send({ message: `Карточка с id(${id}) не найдена` });
    }
    return res.status(OK).send({ message: 'Пост удален' });
  }).catch((err) => {
    if (err.kind === 'ObjectId') {
      return res.status(ERR_BAD_INPUT).send({ message: 'Некорректный id карточки' });
    }
    return res.status(ERR_SERVER_ERR).send({ message: 'Ошибка сервера' });
  });
};

const likeCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    updCardSettings,
  ).then((card) => {
    if (!card) {
      return res.status(ERR_NOT_FOUND).send({ message: `Карточка с id(${id}) не найдена` });
    }
    return res.status(OK).send(prepareSendCard(card));
  }).catch((err) => {
    if (err.kind === 'ObjectId') {
      return res.status(ERR_BAD_INPUT).send({ message: 'Некорректный id карточки' });
    }
    return res.status(ERR_SERVER_ERR).send({ message: 'Ошибка сервера' });
  });
};

const dislikeCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    updCardSettings,
  ).then((card) => {
    if (!card) {
      return res.status(ERR_NOT_FOUND).send({ message: `Карточка с id(${id}) не найдена` });
    }
    return res.status(OK).send(prepareSendCard(card));
  }).catch((err) => {
    if (err.kind === 'ObjectId') {
      return res.status(ERR_BAD_INPUT).send({ message: 'Некорректный id карточки' });
    }
    return res.status(ERR_SERVER_ERR).send({ message: 'Ошибка сервера' });
  });
};

module.exports = {
  getCards,
  createCard,
  rmCard,
  likeCard,
  dislikeCard,
};
