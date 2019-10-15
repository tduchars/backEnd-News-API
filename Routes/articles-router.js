const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticlesById,
  patchArticleVotes,
  postArticleComment
} = require('../controllers/articles-controller');

articlesRouter.route('/').get(getArticles);
articlesRouter
  .route('/:article_id')
  .get(getArticlesById)
  .patch(patchArticleVotes);

articlesRouter.route('/:article_id/comments').post(postArticleComment);

module.exports = articlesRouter;
