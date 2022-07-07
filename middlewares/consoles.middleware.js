const { Console } = require('../models/consoles.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const consoleExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const console = await Console.findOne({ where: { id } });

  if (!console) {
    return next(new AppError('Console not found', 404));
  }

  req.console = console;
  next();
});

module.exports = { consoleExists };
