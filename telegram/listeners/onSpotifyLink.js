const { PLAYLISTS } = require('../../constants');
const { addTrackToPlaylist, trackExists } = require('../../spotify');

async function onSpotifyLink(ctx) {
  const trackMatch = ctx && ctx.match;
  const trackId = trackMatch && trackMatch[1];
  if (!trackMatch || (trackId && trackId.length !== 22)) {
    ctx.reply('Invalid track link sent');
    return;
  }

  try {
    const playlistId = PLAYLISTS[ctx.chat.id];
    const trackUri = `spotify:track:${trackId}`;

    // check if track already exists
    const exists = await trackExists(playlistId, trackId);
    if (exists) {
      console.error(`Track ${trackUri} already exists`);
      ctx.reply('Track already exists in the playlist 💩');
      return;
    }

    await addTrackToPlaylist(playlistId, trackUri);
    console.log('Successfully added to playlist!');
    ctx.reply('Added track to playlist 🎶');
  } catch (err) {
    console.error('Something went wrong while adding track!', err);
    ctx.reply('Failed to add track to playlist');
  }
}

module.exports = onSpotifyLink;
