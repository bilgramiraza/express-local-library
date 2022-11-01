const Book = require('../models/book');

exports.index = (req, res) => {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

exports.book_list = (req, res) => {
  res.send('NOT IMPLEMENTED: BOOK List');
};

exports.book_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: BOOK Detail ${req.params.id}`);
};

exports.book_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BOOK Create GET');
};

exports.book_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BOOK Create POST');
};

exports.book_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BOOK Delete GET');
};

exports.book_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BOOK Delete POST');
};

exports.book_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BOOK Update GET');
};

exports.book_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BOOK Update POST');
};
