exports.formatDates = list => {
  if (list.length === 0) return [];
  const dateFormatted = list.map(article => {
    article.created_at = new Date(article.created_at);
    return article;
  });
  return dateFormatted;
};

exports.makeRefObj = (arr, key, value) => {
  const refObj = {};
  if (arr.length === 0 || !arr) return refObj;
  else {
    for (let i = 0; i < arr.length; i++) {
      refObj[arr[i][key]] = arr[i][value];
    }
    return refObj;
  }
};

function changedKey(arr, oldKeyName, newKeyName, oldKeyName2, newKeyName2) {
  return arr.map(obj => {
    newObj = {};
    for (let key in obj) {
      if (key === oldKeyName) newObj[newKeyName] = obj[key];
      if (key === oldKeyName2) newObj[newKeyName2] = obj[key];
      else newObj[key] = obj[key];
    }
    return newObj;
  });
}

// function changedSingleKey(arr, oldKeyName, newKeyName) {
//   return arr.map(obj => {
//     newObj = {};
//     for (let key in obj) {
//       if (key === oldKeyName) newObj[newKeyName] = obj[key];
//       else newObj[key] = obj[key];
//     }
//     return newObj;
//   });
// }

function formatDatesComments(list) {
  if (list.length === 0) return [];
  const dateFormatted = list.map(article => {
    article.created_at = new Date(article.created_at);
    return article;
  });
  return dateFormatted;
}

exports.formatComments = (comments, articleRef) => {
  if (comments.length === 0) return [];
  const keyChanged = changedKey(
    comments,
    'created_by',
    'author',
    'belongs_to',
    'article_id'
  );
  const commentsFormatted = keyChanged.map(comment => {
    comment['article_id'] = articleRef[comment['article_id']];
    delete comment.created_by;
    return comment;
  });
  const formatDatesForComments = formatDatesComments(commentsFormatted);
  return formatDatesForComments;
};
