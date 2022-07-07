const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const { usersRouter } = require('./routes/users.routes');
const { gamesRouter } = require('./routes/games.routes');
const { consolesRouter } = require('./routes/consoles.routes');

const { globalErrorHandler } = require('./controllers/error.controller');

const { AppError } = require('./utils/appError');

const app = express();

app.set('PORT', process.env.PORT || 5000);

app.use(express.json());

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/games', gamesRouter);
app.use('/api/v1/consoles', consolesRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `${req.method} ${req.originalUrl} not found in this server`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = { app };
