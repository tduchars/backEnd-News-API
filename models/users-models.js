const connection = require('../db/connection');

exports.selectUsers = () => {
  return connection.select().from('users');
};

exports.selectUsersByUsername = username => {
  console.log(username);
};
