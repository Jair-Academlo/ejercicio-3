const { app } = require('./app');
require('colors');

const { User } = require('./models/users.model');
const { Console } = require('./models/consoles.model');
const { Game } = require('./models/games.model');
const { Review } = require('./models/reviews.model');

const { db } = require('./utils/database');

db.authenticate()
  .then(() => console.log('Db authenticated'.yellow))
  .catch(err => console.log(err));

User.hasMany(Review);
Review.belongsTo(User);

Game.hasMany(Review);
Review.belongsTo(Game);

Game.belongsToMany(Console, { through: 'gameInConsole' });
Console.belongsToMany(Game, { through: 'gameInConsole' });

db.sync()
  .then(() => console.log('Db synced'.magenta))
  .catch(err => console.log(err));

app.listen(app.get('PORT'), () => {
  console.log(`Server running on port ${app.get('PORT')}`.cyan);
});
