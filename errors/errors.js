exports.handlePSQL400 = (err, req, res, next) => {
  // console.log(err);
  const codes = ['22P02', '23502', '42703'];
  if (codes.includes(err.code)) {
    res.status(400).send({
      msg: 'Bad Request'
    });
  } else {
    next(err);
  }
};

exports.handlePSQL404 = (err, req, res, next) => {
  const codes = ['23503'];
  if (codes.includes(err.code)) {
    res.status(404).send({
      msg: 'Page not Found'
    });
  } else {
    next(err);
  }
};

exports.handleCustom422s = (err, req, res, next) => {
  if (err.badPatch) {
    res
      .status(422)
      .send({ badPatch: '422 - passed element that did not conform' });
  } else {
    next(err);
  }
};

exports.handleCustom404 = (err, req, res, next) => {
  if (err.username404 || err.article404) {
    res.status(404).send('You searched for an invalid username.');
  } else if (err.noComments) {
    res.status(404).send({
      noComments: 'Did not find a comment for that article.'
    });
  } else if (err.query404) {
    res.status(404).send({
      query404: 'Could not filter by that query.'
    });
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'something broke... :(' });
};
