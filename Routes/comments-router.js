const commentsRouter = require('express').Router();
const { patchCommentsById } = require('../controllers/comments-controllers');

commentsRouter.route('/:comment_id').patch(patchCommentsById);

module.exports = commentsRouter;
