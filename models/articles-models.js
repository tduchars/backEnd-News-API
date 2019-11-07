const connection = require('../db/connection');
const { selectUsersByUsername } = require('./users-models');
const { checkTopicExists } = require('./topics-models');

exports.selectArticles = (
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic,
  limit = 10,
  page = 1
) => {
  let query = connection('articles')
    .select('articles.*')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count({ comment_count: 'comments.comment_id' })
    .groupBy('articles.article_id')
    .modify(query => {
      if (sort_by) query.orderBy(sort_by, order);
      else if (order) query.orderBy(order);
    })
    .modify(query => {
      if (author) query.where('articles.author', '=', author);
    })
    .modify(query => {
      if (topic) query.where('articles.topic', '=', topic);
    });
  const promises = [query];
  if (author) {
    let authorQuery = selectUsersByUsername(author).then(response => {
      if (response.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Could not filter by that author.'
        });
      }
    });
    promises.push(authorQuery);
  }
  if (topic) {
    let topicQuery = checkTopicExists(topic).then(response => {
      if (response.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Could not filter by that topic.'
        });
      }
    });
    promises.push(topicQuery);
  }
  return Promise.all(promises).then(articles => {
    return articles[0];
  });
};

exports.selectArticleById = article_id => {
  return connection('articles')
    .select('articles.*')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count({ comment_count: 'comments.comment_id' })
    .groupBy('articles.article_id')
    .where('articles.article_id', '=', article_id);
};

exports.updateArticleVotes = (article_id, inc_votes = 0) => {
  return connection('articles')
    .where('article_id', '=', article_id)
    .increment('votes', inc_votes)
    .returning('*');
};

exports.insertArticleComment = (comment, article_id) => {
  const authorFormat = {
    author: comment.username,
    body: comment.body,
    article_id
  };
  return connection('comments')
    .insert(authorFormat)
    .where('article_id', '=', article_id)
    .returning('*');
};

exports.selectArticleComments = (
  article_id,
  sort_by = 'created_at',
  order = 'desc'
) => {
  return exports
    .selectArticleById(article_id)
    .then(response => {
      if (response.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Article Not Found'
        });
      }
    })
    .then(() => {
      return connection
        .select()
        .from('comments')
        .where('comments.article_id', '=', article_id)
        .modify(query => {
          if (sort_by) query.orderBy(sort_by, order);
          else if (order) query.orderBy(order);
        });
    });
};
