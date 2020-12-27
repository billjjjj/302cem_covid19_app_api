const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')({ origin: true });

// init
const app = express();
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
  res.send({ message: '/ message' });
  next();
});

module.exports = app;
