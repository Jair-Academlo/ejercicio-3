const express = require('express');

const {
  createUsers,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/users.controller');

const {
  createUserValidators,
} = require('../middlewares/validators.middleware');
const {
  protectSession,
  protectUserAccount,
} = require('../middlewares/auth.middleware');
const { userExists } = require('../middlewares/users.middleware');

const usersRouter = express.Router();

usersRouter.post('/signup', createUserValidators, createUsers);

usersRouter.post('/login', login);

usersRouter.use(protectSession);

usersRouter.get('/', getAllUsers);

usersRouter
  .use('/:id', userExists, protectUserAccount)
  .route('/:id')
  .patch(updateUser)
  .delete(deleteUser);

module.exports = { usersRouter };
