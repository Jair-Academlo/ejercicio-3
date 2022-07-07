const { body, validationResult } = require('express-validator');

const { AppError } = require('../utils/appError');

const checkResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map(error => error.msg)
      .join('. ');

    return next(new AppError(errorMessage, 400));
  }

  next();
};

const createUserValidators = [
  body('name').notEmpty().withMessage('Name can not be empty'),
  body('email').isEmail().withMessage('Must provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password can not be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .isAlphanumeric('en-US')
    .withMessage('Password must contain letters and numbers'),
  checkResult,
];

const createGameValidators = [
  body('title').notEmpty().withMessage('Title can not be empty'),
  body('genre').notEmpty().withMessage('Genre can not be empty'),
  checkResult,
];

const createReviewValidators = [
  body('comment').notEmpty().withMessage('Comment can not be empty'),
  checkResult,
];

const createConsoleValidators = [
  body('name').notEmpty().withMessage('Name can not be empty'),
  body('company').notEmpty().withMessage('Company can not be empty'),
  checkResult,
];

const assignGameValidators = [
  body('gameId')
    .notEmpty()
    .withMessage('gameId can not be empty')
    .isNumeric()
    .withMessage('Must be a number'),
  body('consoleId')
    .notEmpty()
    .withMessage('consoleId can not be empty')
    .isNumeric()
    .withMessage('Must be a number'),
  checkResult,
];

module.exports = {
  createUserValidators,
  createGameValidators,
  createReviewValidators,
  createConsoleValidators,
  assignGameValidators,
};
