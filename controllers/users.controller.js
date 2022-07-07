const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

/* En los controllers la ruta
   del config.env me funciona con los dos puntos,
   que ubican el arcivo raiz,
   no se si sea por el sistema operativo que utilizo,
   ya que estoy utilizando linux,
   en el archvo database, si funciona con un solo punto*/

dotenv.config({ path: '../config.env' });

const { User } = require('../models/users.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const createUsers = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user) {
    return next(new AppError('This email already exists', 400));
  }

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  });

  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    newUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(new AppError('Credentials invalid', 400));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError('Credentials invalid', 400));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });

  res.status(200).json({
    status: 'success',
    user,
    token,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });

  res.status(204).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'disabled' });

  res.status(204).json({ status: 'success' });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: { status: 'active' },
    attributes: ['id', 'name', 'email', 'status'],
  });

  res.status(200).json({
    status: 'success',
    users,
  });
});
module.exports = { createUsers, login, updateUser, deleteUser, getAllUsers };
