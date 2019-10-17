const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics-controllers');
const { handle405 } = require('../errors/errors');

topicsRouter
  .route('/')
  .get(getTopics)
  .all(handle405);

module.exports = topicsRouter;
