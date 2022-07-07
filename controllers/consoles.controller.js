const { Console } = require('../models/consoles.model');
const { Game } = require('../models/games.model');
const { GameInConsole } = require('../models/gamesInConsoles.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const getAllConsoles = catchAsync(async (req, res, next) => {
  const consoles = await Console.findAll({
    attributes: ['id', 'name', 'company', 'status'],
    include: {
      model: Game,
      attributes: ['id', 'title', 'genre', 'status'],
      through: { attributes: [] },
    },
  });

  res.status(200).json({
    status: 'success',
    consoles,
  });
});

const createConsole = catchAsync(async (req, res, next) => {
  const { name, company } = req.body;

  const console = await Console.findOne({ where: { name } });

  if (console) {
    return next(new AppError('This console already exists', 400));
  }

  const newConsole = await Console.create({
    name,
    company,
  });

  res.status(201).json({
    status: 'success',
    newConsole,
  });
});

const assignGame = catchAsync(async (req, res, next) => {
  const { gameId, consoleId } = req.body;

  const gameInConsole = await GameInConsole.create({
    gameId,
    consoleId,
  });

  res.status(201).json({
    status: 'success',
    gameInConsole,
  });
});

const updateConsole = catchAsync(async (req, res, next) => {
  const { console } = req;
  const { name } = req.body;

  await console.update({ name });

  res.status(204).json({
    status: 'success',
  });
});

const deleteConsole = catchAsync(async (req, res, next) => {
  const { console } = req;

  await console.update({ status: 'disabled' });

  res.status(204).json({
    status: 'success',
  });
});

module.exports = {
  getAllConsoles,
  createConsole,
  assignGame,
  updateConsole,
  deleteConsole,
};
