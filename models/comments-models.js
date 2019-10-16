const connection = require('../db/connection');

exports.updateCommentsById = (comment_id, inc_votes) => {
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .increment('votes', inc_votes)
    .returning('*');
};
