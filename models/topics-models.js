const connection = require('../db/connection');

exports.selectTopics = () => {
  return connection.select().table('topics');
};
