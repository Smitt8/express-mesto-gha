const Card = require('../models/card');

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

  const card = Card.findById(id);
  if (!card) {
    return res.status(404).send({ message: 'Такой карточки не существует' });
  }
  Card.deleteOne(card);
  return res.status(200).send({ message: 'Пост удален' });
};

module.exports = {
  getCards,
  createCard,
  rmCard,
};
