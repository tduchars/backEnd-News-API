const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex('topics')
        .insert(topicData)
        .returning('*');
      const usersInsertions = knex('users')
        .insert(userData)
        .returning('*');
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(([topicRows, userRows]) => {
      console.log(userRows.length, 'users inserted');
      console.log(topicRows.length, 'topics inserted');
      const formattedDates = formatDates(articleData);
      return knex
        .insert(formattedDates)
        .into('articles')
        .returning('*');
    })
    .then(articleRows => {
      console.log(articleRows.length, 'articles inserted');
      const articleRef = makeRefObj(articleRows, 'title', 'article_id');
      const formattedComments = formatComments(commentData, articleRef);
      return knex('comments')
        .insert(formattedComments)
        .returning('*');
    })
    .then(commentRows => {
      console.log(commentRows.length, 'comments inserted');
    });
};
