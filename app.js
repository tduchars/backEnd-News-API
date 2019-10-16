const express = require('express');
const app = express();
const apiRouter = require('./Routes/api-router.js');
const {
  handlePSQL400,
  handlePSQL404,
  handleCustom404,
  handleCustom422s,
  handle500
} = require('./errors/errors');

//allows access to body object (parse json)
app.use(express.json());

//routers
app.use('/api', apiRouter);

// wildcard
app.all('/*', (req, res, next) => {
  res.status(404).send({ wildcard: 'Page not found!' });
});

app.use(handlePSQL400);
app.use(handlePSQL404);
app.use(handleCustom404);
app.use(handleCustom422s);
app.use(handle500);

module.exports = app;
