const author = require('../models/author');

exports.author_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Author List');
};

exports.author_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Author Detail: ${req.params.id}`);
};

exports.author_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Author Create GET ');
};

exports.author_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Author Create POST ');
};

exports.author_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Author Delete GET');
};

exports.author_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Author Delete POST');
};

exports.author_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Author Update GET');
};

exports.author_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Author Update POST');
};
