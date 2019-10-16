const {
  selectArticles,
  selectArticleById,
  updateArticleVotes,
  insertArticleComment,
  selectArticleComments
} = require('../models/articles-models');

//if null - default assertion in model params?
exports.getArticles = (req, res, next) => {
  let { sort_by } = req.query;
  let { order } = req.query;
  const validOrder = ['asc', 'desc'];
  if (!validOrder.includes(order)) {
    order = undefined;
  }
  selectArticles(sort_by, order)
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
      if (!inc_votes) {
        return Promise.reject({
          badPatch: 'Invalid Patch elements passed.'
        });
      } else if (!article) {
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
      res.status(201).send({
        comment
      });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleComments(article_id)
    .then(comments => {
      res.status(200).send({
        comments
      });
    })
    .catch(next);
};
