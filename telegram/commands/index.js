const login = require('./login');
const playlist = require('./playlist');

function init(bot) {
  bot.command('login', login);
  bot.command('playlist', playlist);
}

module.exports.init = init;
