const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const { body, validationResult } = require('express-validator');

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

exports.genre_create_get = (req, res, next) => {
  res.render('genre_form', { title: 'Genre Creation Form' });
};

exports.genre_create_post = [
  body('name', 'Genre Name Required').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Genre Creation Form',
        genre,
        errors: errors.array(),
      });
      return;
    }
    Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
      if (err) return next(err);
      if (found_genre) {
        res.redirect(found_genre.url);
      } else {
        genre.save((err) => {
          if (err) return next(err);
          res.redirect(genre.url);
        });
      }
    });
  },
];

exports.genre_delete_get = (req, res, next) => {
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
      if (results.genre === null) res.redirect('/catalog/genres');
      res.render('genre_delete', {
        title: 'Delete Genre',
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
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
