const BookInstance = require('../models/bookinstance');

exports.bookinstance_list = (req, res, next) => {
  BookInstance.find()
    .populate('book')
    .exec((err, list_bookinstances) => {
      if (err) return next(err);
      res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: list_bookinstances,
      });
    });
};

exports.bookinstance_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: BookInstance detail ${req.params.id}`);
};

exports.bookinstance_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance Create GET ');
};

exports.bookinstance_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance Create POST ');
};

exports.bookinstance_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance Delete GET');
};

exports.bookinstance_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance Delete POST');
};

exports.bookinstance_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance Update GET');
};

exports.bookinstance_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance Update POST');
};
