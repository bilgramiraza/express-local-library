const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

const async = require('async');

exports.index = (req, res) => {
  async.parallel(
    {
      book_count(callback) {
        Book.countDocuments({}, callback);
      },
      book_instance_count(callback) {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count(callback) {
        BookInstance.countDocuments({ status: 'Available' }, callback);
      },
      author_count(callback) {
        Author.countDocuments({}, callback);
      },
      genre_count(callback) {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render('index', {
        title: 'Local Library Home',
        error: err,
        data: results,
      });
    }
  );
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
