const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticlesById,
  patchArticleVotes,
  postArticleComment,
  getArticleComments
} = require('../controllers/articles-controller');
const { handle405 } = require('../errors/errors');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(handle405);
articlesRouter
  .route('/:article_id')
  .get(getArticlesById)
  .patch(patchArticleVotes)
  .all(handle405);
articlesRouter
  .route('/:article_id/comments')
  .post(postArticleComment)
  .get(getArticleComments)
  .all(handle405);
module.exports = articlesRouter;
