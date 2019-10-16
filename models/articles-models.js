const connection = require('../db/connection');

exports.selectArticles = (sort_by = 'created_at', order = 'desc') => {
  return connection
    .select()
    .from('articles')
    .modify(query => {
      if (sort_by) query.orderBy(sort_by, order);
      else if (order) query.orderBy(order);
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

//add queries then go to 405 method not allowed in routers...
exports.selectArticleComments = article_id => {
  return connection
    .select()
    .from('comments')
    .where('comments.article_id', '=', article_id);
};
