const express = require('express');
const mongoose = require('mongoose');

const { cardsRoutes } = require('./routes/cards');
const { usersRoutes } = require('./routes/users');
const { ERR_NOT_FOUND } = require('./utils/consts');

const { PORT = 3000 } = process.env;

const app = express();

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  app.use((req, res, next) => {
    req.user = {
      _id: '630908c8adb6ec8178e45070',
    };
    next();
  });

  app.use(express.json());

  app.use(cardsRoutes);
  app.use(usersRoutes);

  app.use((req, res) => {
    res.status(ERR_NOT_FOUND).send({ message: 'Страница не найдена' });
  });

  await app.listen(PORT);

  console.log(`Listening on port [:${PORT}]...`);
}

main();
