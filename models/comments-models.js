const connection = require('../db/connection');

exports.updateCommentById = (comment_id, inc_votes = 0) => {
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .increment('votes', inc_votes)
    .returning('*');
};

exports.delCommentById = comment_id => {
  return connection('comments')
    .where('comment_id', comment_id)
    .del();
};
