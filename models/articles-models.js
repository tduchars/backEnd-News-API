const connection = require('../db/connection');

exports.selectArticles = () => {
  return connection.select().from('articles');
};

exports.selectArticleById = article_id => {
  return connection
    .from('articles')
    .innerJoin('comments', 'comments.artice_id', '=', article_id);
};

exports.updateArticleVotes = (article_id, inc_votes) => {
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
