const express = require('express');
const app = express();
const apiRouter = require('./Routes/api-router.js');
const { handle404, handle500 } = require('./errors/errors');

//allows access to body object (parse json)
app.use(express.json());

//routers
app.use('/api', apiRouter);

// wildcard
app.all('/*', (req, res, next) => {
  res.status(404).send({ wildcard: 'Page not found!' });
});

app.use(handle404);
app.use(handle500);

module.exports = app;
