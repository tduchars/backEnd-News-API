const connection = require('../db/connection');

exports.selectTopics = () => {
  return connection.select().table('topics');
};

exports.checkTopicExists = topic => {
  return connection
    .select()
    .from('topics')
    .where('topics.slug', '=', topic);
};
