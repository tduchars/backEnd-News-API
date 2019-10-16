const { updateCommentsById } = require('../models/comments-models');

exports.patchCommentsById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentsById(comment_id, inc_votes)
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
