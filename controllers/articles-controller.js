const {
  selectArticles,
  selectArticleById,
  updateArticleVotes,
  insertArticleComment
} = require('../models/articles-models');

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then(articles => {
      res.status(200).send({
        articles
      });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id).then(([article]) => {
    res.status(200).send({
      article
    });
  });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes).then(([article]) => {
    res.status(200).send({
      article
    });
  });
};

exports.postArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  insertArticleComment(req.body, article_id).then(([comment]) => {
    res.status(201).send({
      comment
    });
  });
};
