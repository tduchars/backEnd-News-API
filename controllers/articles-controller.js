const {
  selectArticles,
  selectArticleById,
  updateArticleVotes,
  insertArticleComment,
  selectArticleComments
} = require('../models/articles-models');

exports.getArticles = (req, res, next) => {
  let { sort_by, order, author, topic, limit, page } = req.query;
  const validOrder = ['asc', 'desc'];
  if (!validOrder.includes(order)) {
    order = undefined;
  }
  selectArticles(sort_by, order, author, topic, limit, page)
    .then(articles => {
      res.status(200).send({
        articles
      });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          username404: 'You searched for an invalid username.'
        });
      } else {
        res.status(200).send({
          article
        });
      }
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          username404: 'You searched for an invalid username.'
        });
      }
      res.status(200).send({
        article
      });
    })
    .catch(next);
};

exports.postArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  insertArticleComment(req.body, article_id)
    .then(([comment]) => {
      if (!comment.author) {
        return Promise.reject({ incompleteRequest: 'Incomplete Request' });
      }
      res.status(201).send({
        comment
      });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  let { sort_by } = req.query;
  let { order } = req.query;
  const validOrder = ['asc', 'desc'];
  if (!validOrder.includes(order)) {
    order = undefined;
  }
  selectArticleComments(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({
        comments
      });
    })
    .catch(next);
};
