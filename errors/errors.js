exports.handle404 = (err, req, res, next) => {
  console.log(err);
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'something broke...' });
};
