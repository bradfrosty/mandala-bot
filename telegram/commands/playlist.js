const { PLAYLISTS } = require('../../constants');

const PLAYLIST_LINK_REGEX = /^https:\/\/open.spotify.com\/user\/.*\/playlist\/([a-zA-Z0-9]+).*$/;

function playlist(ctx) {
  const chatId = ctx.chat.id;
  const commandArg = ctx.message.text.split('playlist ')[1] || '';
  const playlistMatch = commandArg.match(PLAYLIST_LINK_REGEX);
  if (!playlistMatch) {
    ctx.reply(`Invalid playlist link.`);
    return;
  }

  const playlistId = playlistMatch[1];
  PLAYLISTS[chatId] = playlistId;
  const msg = `Set chat playlist to ${playlistMatch[1]} for chat:${ctx.chat.title || chatId}`;
  console.log(msg);
  ctx.reply(msg);
}

module.exports = playlist;
