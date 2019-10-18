const connection = require('../db/connection');

exports.selectUsers = () => {
  return connection.select().from('users');
};

exports.selectUsersByUsername = author => {
  return connection
    .select()
    .from('users')
    .where('users.username', '=', author);
};
