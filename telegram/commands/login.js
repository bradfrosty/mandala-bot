const { AUTHORIZE_URL } = require('../../spotify');

function login(ctx) {
  // check if already logged in
  ctx.reply('Spotify not logged in. Login with this link and try again!');
  ctx.reply(AUTHORIZE_URL);
}

module.exports = login;
