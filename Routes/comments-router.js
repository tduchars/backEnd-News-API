const commentsRouter = require('express').Router();
const {
  patchCommentById,
  deleteCommentById
} = require('../controllers/comments-controllers');

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById);

module.exports = commentsRouter;
