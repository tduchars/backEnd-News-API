const usersRouter = require('express').Router();
const {
  getUsers,
  getUsersByUsername
} = require('../controllers/users-controllers');
const { handle405 } = require('../errors/errors');

usersRouter
  .route('/')
  .get(getUsers)
  .all(handle405);
usersRouter
  .route('/:author')
  .get(getUsersByUsername)
  .all(handle405);

module.exports = usersRouter;
