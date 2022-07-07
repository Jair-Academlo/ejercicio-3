const { Console } = require('../models/consoles.model');
const { Review } = require('../models/reviews.model');
const { Game } = require('../models/games.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const getAllGames = catchAsync(async (req, res, next) => {
  const games = await Game.findAll({
    attributes: ['id', 'title', 'genre', 'status'],
    include: [
      {
        model: Review,
        attributes: ['id', 'userId', 'gameId', 'comment', 'status'],
      },
      {
        model: Console,
        attributes: ['id', 'name', 'company', 'status'],
        through: { attributes: [] },
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    games,
  });
});

const createGame = catchAsync(async (req, res, next) => {
  const { title, genre } = req.body;

  const game = await Game.findOne({ where: { title } });

  if (game) {
    return next(new AppError('This game already exists', 400));
  }

  const newGame = await Game.create({
    title,
    genre,
  });

  res.status(201).json({
    status: 'success',
    newGame,
  });
});

const createGameReview = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { gameId } = req.params;
  const { comment } = req.body;

  const newReview = await Review.create({
    userId: sessionUser.id,
    gameId,
    comment,
  });

  res.status(201).json({
    status: 'success',
    newReview,
  });
});

const updateGame = catchAsync(async (req, res, next) => {
  const { game } = req;
  const { title } = req.body;

  await game.update({ title });

  res.status(204).json({
    status: 'success',
  });
});

const deleteGame = catchAsync(async (req, res, next) => {
  const { game } = req;

  await game.update({ status: 'disabled' });

  res.status(204).json({
    status: 'success',
  });
});

module.exports = {
  getAllGames,
  createGame,
  createGameReview,
  updateGame,
  deleteGame,
};
