const Card = require('../models/card');

const updCardSettings = {
  new: true,
};

const getCards = async (req, res) => {
  const cards = await Card.find({});

  if (cards.length === 0) {
    return res.status(404).send({ message: 'Нет доступных карточек' });
  }

  return res.status(200).send(cards);
};

const createCard = async (req, res) => {
  const card = new Card(req.body);

  card.owner = req.user._id;
  await card.save();

  res.status(200).send(card);
};

const rmCard = async (req, res) => {
  const { id } = req.params;
  await Card.findByIdAndDelete(id);
  res.status(200).send({ message: 'Пост удален' });
};

const likeCard = async (req, res) => {
  const { id } = req.params;
  const card = await Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    updCardSettings,
  );

  res.status(200).send(card);
};

const dislikeCard = async (req, res) => {
  const { id } = req.params;
  const card = await Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    updCardSettings,
  );

  res.status(200).send(card);
};

module.exports = {
  getCards,
  createCard,
  rmCard,
  likeCard,
  dislikeCard,
};
