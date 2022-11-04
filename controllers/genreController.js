const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');

exports.genre_list = (req, res, next) => {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec((err, list_genre) => {
      if (err) return next(err);
      res.render('genre_list', { title: 'Genre List', genre_list: list_genre });
    });
};

exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.genre == null) {
        const err = new Error('Genre Not Found');
        err.status = 404;
        return next(err);
      }
      res.render('genre_detail', {
        title: 'Genre Detail',
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

exports.genre_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre Create GET');
};

exports.genre_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre Create POST');
};

exports.genre_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre Delete GET');
};

exports.genre_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre Delete POST');
};

exports.genre_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre Update GET');
};

exports.genre_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre Update POST');
};
