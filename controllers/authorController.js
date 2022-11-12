const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.author_list = (req, res, next) => {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec((err, list_authors) => {
      if (err) return next(err);
      res.render('author_list', { title: 'Authors List', author_list: list_authors });
    });
};

exports.author_detail = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      author_books(callback) {
        Book.find({ author: req.params.id }, 'title summary').exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.author == null) {
        const err = new Error('Author Not Found');
        err.status = 404;
        return next(err);
      }

      res.render('author_detail', {
        title: results.author.name,
        author: results.author,
        author_books: results.author_books,
      });
    }
  );
};

exports.author_create_get = (req, res, next) => {
  res.render('author_form', { title: 'Author Creation Form' });
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
