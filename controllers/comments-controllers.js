const {
  updateCommentById,
  delCommentById
} = require('../models/comments-models');

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then(([comment]) => {
      if (typeof inc_votes === 'number' && !comment) {
        return Promise.reject({
          status: 404,
          msg: 'Article Not Found'
        });
      }
      console.log(comment);
      res.status(200).send({
        comment
      });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  delCommentById(comment_id)
    .then(response => {
      if (response === 0) {
        return Promise.reject({
          noComment: '404 - no comment to delete'
        });
      }
      res.status(204).send({ msg: 'no content to send' });
    })
    .catch(next);
};
