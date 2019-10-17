const commentsRouter = require('express').Router();
const {
  patchCommentById,
  deleteCommentById
} = require('../controllers/comments-controllers');
const { handle405 } = require('../errors/errors');

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(handle405);

module.exports = commentsRouter;
