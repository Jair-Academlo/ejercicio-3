const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

/* En el middleware la ruta
   del config.env me funciona con los dos puntos,
   que ubican el arcivo raiz,
   no se si sea por el sistema operativo que utilizo,
   ya que estoy utilizando linux,
   en el archvo database, si funciona con un solo punto*/

dotenv.config({ path: '../config.env' });

const { User } = require('../models/users.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const protectSession = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new AppError('Invalid token', 403));
  }

  const token = authorization.split(' ')[1];

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: 'active',
    },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token does not exist anymore', 403)
    );
  }

  req.sessionUser = user;
  next();
});

const protectUserAccount = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('You do not own this account', 403));
  }

  next();
});

module.exports = { protectSession, protectUserAccount };
