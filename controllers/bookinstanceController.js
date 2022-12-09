const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');
const async = require('async');
const { body, validationResult } = require('express-validator');

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

exports.bookinstance_detail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec((err, bookinstance) => {
      if (err) return next(err);
      if (bookinstance == null) {
        const err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }
      res.render('bookinstance_detail', {
        bookinstance,
      });
    });
};

exports.bookinstance_create_get = (req, res, next) => {
  Book.find({}, 'title').exec((err, books) => {
    if (err) return next(err);
    res.render('bookinstance_form', {
      title: 'Add A New Copy of a Book',
      book_list: books,
    });
  });
};

exports.bookinstance_create_post = [
  body('book', 'Book Must Be Specified').trim().isLength({ min: 1 }).escape(),
  body('status').escape(),
  body('imprint', 'Imprint Must be Specified').trim().isLength({ min: 1 }).escape(),
  body('due_back', 'Invalid Date').optional({ checkFalsy: 'true' }).isISO8601().toDate(),
  (req, res, next) => {
    const errors = validationResult(req);

    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      Book.find({}, 'title').exec((err, books) => {
        if (err) return next(err);
        res.render('bookinstance_form', {
          title: 'Add A New Copy of a Book',
          book_list: books,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance,
        });
      });
      return;
    }

    bookinstance.save((err) => {
      if (err) return next(err);
      res.redirect(bookinstance.url);
    });
  },
];

exports.bookinstance_delete_get = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec((err, bookinstance) => {
      if (err) return next(err);
      if (bookinstance === null) res.redirect('/catalog/bookinstances');
      res.render('bookinstance_delete', {
        title: 'Delete Copy',
        book_copy: bookinstance,
      });
    });
};

exports.bookinstance_delete_post = (req, res, next) => {
  BookInstance.findById(req.body.instanceid).exec((err, bookinstance) => {
    if (err) return next(err);
    BookInstance.findByIdAndDelete(req.body.instanceid, (err) => {
      if (err) return next(err);
      res.redirect('/catalog/bookinstances');
    });
  });
};

exports.bookinstance_update_get = (req, res, next) => {
  async.parallel(
    {
      books(callback) {
        Book.find({}, 'title').exec(callback);
      },
      book_details(callback) {
        BookInstance.findById(req.params.id).populate('book').exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.book_details == null) {
        const err = new Error('Book Copy Not Found');
        err.status = 404;
        return next(err);
      }
      res.render('bookinstance_form', {
        title: 'Update Book Copy',
        book_list: results.books,
        selected_book: results.book_details.book._id,
        bookinstance: book_details,
      });
    }
  );
};

exports.bookinstance_update_post = [
  body('book', 'Book Must Be Specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint Must be Specified').trim().isLength({ min: 1 }).escape(),
  body('status').escape(),
  body('due_back', 'Invalid Date').optional({ checkFalsy: 'true' }).isISO8601().toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    const book_copy = new BookInstance({
      _id: req.params.id,
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });
    if (!errors.isEmpty()) {
      Book.find({}, 'title').exec((err, books) => {
        if (err) return next(err);
        res.render('bookinstance_form', {
          title: 'Update Book Copy',
          book_list: books,
          selected_book: book_copy.book._id,
          errors: errors.array(),
          bookinstance: book_copy,
        });
      });
      return;
    }
    BookInstance.findByIdAndUpdate(req.params.id, book_copy, {}, (err, thebookcopy) => {
      if (err) return next(err);
      res.redirect(thebookcopy.url);
    });
  },
];
