const {
  selectUsersByUsername,
  selectUsers
} = require('../models/users-models');

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then(users => {
      res.status(200).send({
        users
      });
    })
    .catch(next);
};

exports.getUsersByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUsersByUsername(username)
    .then(([user]) => {
      if (!user) {
        return Promise.reject({
          username404: 'You searched for an invalid username.'
        });
      } else {
        res.status(200).send({
          user
        });
      }
    })
    .catch(next);
};
