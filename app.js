const express = require('express');
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/api-router');
const {
  handlePSQL400,
  handlePSQL404,
  handleCustom400,
  handleCustom404,
  handleCustom422s,
  handle500
} = require('./errors/errors');

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
  res.status(404).send({ wildcard: 'Page not found!' });
});

app.use(handlePSQL400);
app.use(handlePSQL404);
app.use(handleCustom400);
app.use(handleCustom404);
app.use(handleCustom422s);
app.use(handle500);

module.exports = app;
