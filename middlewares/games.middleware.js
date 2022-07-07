const { Game } = require('../models/games.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const gameExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const game = await Game.findOne({ where: { id } });

  if (!game) {
    return next(new AppError('Game not found', 404));
  }

  req.game = game;
  next();
});

module.exports = { gameExists };
