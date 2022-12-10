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
  res.render('author_form', { title: 'Add New Author' });
};

exports.author_create_post = [
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First Name Must Be Specified'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family Name Must Be Specified'),
  body('date_of_birth', 'Invalid Date of Birth')
    .optional({ checkFalsy: 'true' })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid Date of Death')
    .optional({ checkFalsy: 'true' })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('author_form', {
        title: 'Add New Author',
        author: req.body,
        errors: errors.array(),
      });
      return;
    }
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });
    author.save((err) => {
      if (err) return next(err);
      res.redirect(author.url);
    });
  },
];

exports.author_delete_get = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      author_books(callback) {
        Book.find({ author: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.author == null) res.redirect('/catalog/authors');
      res.render('author_delete', {
        title: 'Delete Author',
        author: results.author,
        author_books: results.author_books,
      });
    }
  );
};

exports.author_delete_post = (req, res, next) => {
  async.parallel(
    {
      authors(callback) {
        Author.findById(req.body.authorid).exec(callback);
      },
      authors_books(callback) {
        Book.find({ author: req.body.authorid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.authors_books.length > 0) {
        res.render('author_delete', {
          title: 'Delete Author',
          author: results.author,
          author_books: results.authors_books,
        });
        return;
      }
      Author.findByIdAndDelete(req.body.authorid, (err) => {
        if (err) return next(err);
        res.redirect('/catalog/authors');
      });
    }
  );
};

exports.author_update_get = (req, res, next) => {
  Author.findById(req.params.id, (err, author) => {
    if (err) return next(err);
    if (author == null) {
      const err = new Error('Author Not Found');
      err.status = 404;
      return next(err);
    }
    res.render('author_form', {
      title: 'Update Author',
      author,
    });
  });
};

exports.author_update_post = [
  body('first_name', 'First Name must not be Empty').trim().isLength({ min: 1 }).escape(),
  body('family_name', 'Family Name must not be Empty').trim().isLength({ min: 1 }).escape(),
  body('date_of_birth', 'Invalid Date of Birth')
    .optional({ checkFalsy: 'true' })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid Date of Death')
    .optional({ checkFalsy: 'true' })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    const author = new Author({
      _id: req.params.id,
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });
    if (!errors.isEmpty()) {
      res.render('author_form', {
        title: 'Update Author',
        author,
        errors: errors.array(),
      });
      return;
    }
    Author.findByIdAndUpdate(req.params.id, author, {}, (err, theauthor) => {
      if (err) return next(err);
      res.redirect(theauthor.url);
    });
  },
];
