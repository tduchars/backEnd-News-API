const connection = require('../db/connection');

exports.selectUsers = () => {
  return connection.select().from('users');
};

exports.selectUsersByUsername = username => {
  return connection
    .select()
    .from('users')
    .where('users.username', '=', username);
};
