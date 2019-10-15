const usersRouter = require('express').Router();
const {
  getUsers,
  getUsersByUsername
} = require('../controllers/users-controllers');

usersRouter.route('/').get(getUsers);
usersRouter.route('/:username').get(getUsersByUsername);

module.exports = usersRouter;
