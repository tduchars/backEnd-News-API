const {
  updateCommentById,
  delCommentById
} = require('../models/comments-models');

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then(([newVote]) => {
      if (!inc_votes) {
        return Promise.reject({
          badPatch: '422 - passed element that did not conform'
        });
      }
      res.status(200).send({
        newVote
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
