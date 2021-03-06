exports.handlePSQL400 = (err, req, res, next) => {
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
  } else if (err.msg) {
    res.status(err.status).send(err);
  } else if (err.noComment) {
    res.status(404).send({
      noComment: '404 - no comment to delete'
    });
  } else {
    next(err);
  }
};

exports.handleCustom400 = (err, req, res, next) => {
  if (err.incompleteRequest) {
    res.status(400).send({ incompleteRequest: 'Incomplete Request' });
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'something broke... :(' });
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed on that endpoint' });
};
