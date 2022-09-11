const cookieParser = require('cookie-parser');
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

  app.use(express.json());
  app.use(cookieParser());

  app.use(usersRoutes);
  app.use(cardsRoutes);

  app.use((req, res) => {
    res.status(ERR_NOT_FOUND).send({ message: 'Страница не найдена' });
  });

  await app.listen(PORT);

  console.log(`Listening on port [:${PORT}]...`);
}

main();
