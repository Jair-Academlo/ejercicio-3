const { db, DataTypes } = require('../utils/database.js');

const { Game } = require('./games.model');
const { Console } = require('./consoles.model');

const GameInConsole = db.define('gameInConsole', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Game,
      key: 'id',
    },
  },
  consoleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Console,
      key: 'id',
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = { GameInConsole };
