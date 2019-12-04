const onSpotifyLink = require('./onSpotifyLink');

const trackLinkRegex = /^https:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)/;

function init(bot) {
  bot.hears('otters', ctx => ctx.reply('are the greatest thing ever'));
  bot.hears(trackLinkRegex, onSpotifyLink);
}

module.exports.init = init;
