const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

const async = require('async');
const { body, validationResult } = require('express-validator');

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

exports.book_list = (req, res, next) => {
  Book.find({}, 'title author')
    .sort({ title: 1 })
    .populate('author')
    .exec((err, list_books) => {
      if (err) return err;
      res.render('book_list', { title: 'Book List', book_list: list_books });
    });
};

exports.book_detail = (req, res, next) => {
  async.parallel(
    {
      book(callback) {
        Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
      },
      book_instance(callback) {
        BookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.book == null) {
        const err = new Error('Book Not Found');
        err.status = 404;
        return next(err);
      }
      res.render('book_detail', {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance,
      });
    }
  );
};

exports.book_create_get = (req, res, next) => {
  async.parallel(
    {
      authors(callback) {
        Author.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      res.render('book_form', {
        title: 'Add New Book',
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
};

exports.book_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body('author', 'Author must not be empty').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty').trim().isLength({ min: 1 }).escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors(callback) {
            Author.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) return next(err);

          for (const genre in results.genre) {
            if (book.genre.includes(genre._id)) {
              genre.checked = 'true';
            }
          }
          res.render('book_form', {
            title: 'Add New Book',
            authors: results.authors,
            genres: results.genres,
            book,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    book.save((err) => {
      if (err) return next(err);

      res.redirect(book.url);
    });
  },
];

exports.book_delete_get = (req, res, next) => {
  async.parallel(
    {
      book(callback) {
        Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
      },
      book_copies(callback) {
        BookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.book === null) res.redirect('/catalog/books');
      res.render('book_delete', {
        title: 'Delete Book',
        book: results.book,
        book_copies: results.book_copies,
      });
    }
  );
};

exports.book_delete_post = (req, res, next) => {
  async.parallel(
    {
      book(callback) {
        Book.findById(req.body.bookid).populate('author').populate('genre').exec(callback);
      },
      book_copies(callback) {
        BookInstance.find({ book: req.body.bookid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.book_copies.length > 0) {
        res.render('book_delete', {
          title: 'Delete Book',
          book: results.book,
          book_copies: results.book_copies,
        });
        return;
      }
      Book.findByIdAndDelete(req.body.bookid, (err) => {
        if (err) return next(err);
        res.redirect('/catalog/books');
      });
    }
  );
};

exports.book_update_get = (req, res, next) => {
  async.parallel(
    {
      book(callback) {
        Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
      },
      authors(callback) {
        Author.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.book == null) {
        const err = new Error('Book Not Found');
        err.status = 404;
        return next(err);
      }
      for (const genre of results.genres) {
        for (const bookGenre of results.book.genre) {
          if (genre._id.toString() === bookGenre._id.toString()) {
            genre.checked = 'true';
          }
        }
      }
      res.render('book_form', {
        title: 'Update Book',
        authors: results.authors,
        genres: results.genres,
        book: results.book,
      });
    }
  );
};

exports.book_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },
  body('title', 'Title Must Not Be Empty').trim().isLength({ min: 1 }).escape(),
  body('author', 'Author Must Not Be Empty').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary Must Not Be Empty').trim().isLength({ min: 1 }).escape(),
  body('isbn', 'ISBN Must Not Be Empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors(callback) {
            Author.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) return next(err);
          for (const genre of results.genres) {
            if (book.genre.includes(genre._id)) {
              genre.checked = 'true';
            }
          }
          res.render('book_form', {
            title: 'Update Book',
            authors: results.authors,
            genres: results.genres,
            book,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    Book.findByIdAndUpdate(req.params.id, book, {}, (err, thebook) => {
      if (err) return next(err);
      res.redirect(thebook.url);
    });
  },
];
