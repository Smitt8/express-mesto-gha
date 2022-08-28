const express = require('express');
const mongoose = require('mongoose');

const { routes } = require('./routes/index');

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

  app.use(routes);

  await app.listen(PORT);

  console.log(`Listening on port [:${PORT}]...`);
}

main();
