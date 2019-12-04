const SpotifyWebApi = require('spotify-web-api-node');
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = require('../constants');

const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  redirectUri: SPOTIFY_REDIRECT_URI,
});

const AUTHORIZE_URL = spotifyApi.createAuthorizeURL([
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
]);

async function requestSpotify(requestCb) {
  const response = await requestCb();
  console.log('Rate limitnig spotify', response.statusCode, response.headers);
  if (response.statusCode === 429) {
    const retryAfter = response.headers['retry-after'];
    console.log(`Too many requests, trying again in ${retryAfter}s`);
    setTimeout(async () => await requestCb(), retryAfter * 1000);
  }
}

function setAccessTokens(accessToken, refreshToken) {
  console.log(`Setting access tokens:
  accessToken: ${accessToken}
  refreshToken: ${refreshToken}
  `);
  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);
}

async function authorize(code) {
  try {
    let data = await spotifyApi.authorizationCodeGrant(code);
    let access_token = data.body['access_token'];
    let refresh_token = data.body['refresh_token'];

    // Set the access token on the API object to use it in later calls
    setAccessTokens(access_token, refresh_token);

    // Schedule token to refresh
    console.log(`Scheduling interval every ${data.body['expires_in']}s`);
    setInterval(async () => {
      try {
        console.log('Refreshing spotify access token');
        data = await spotifyApi.refreshAccessToken();
        access_token = data.body['access_token'];

        if (data.body['refresh_token']) {
          console.log('Retreived new refresh_token');
          refresh_token = data.body['refresh_token'];
        }

        setAccessTokens(access_token, refresh_token);
      } catch (err) {
        console.error('Failed to refresh spotify tokens', err);
      }
    }, data.body['expires_in'] * 1000);
  } catch (err) {
    console.error('Spotify failed to auth!', err);
  }
}

async function getPlaylists(playlistId) {
  console.log('Getting playlist ' + playlistId);
  const data = await spotifyApi.getPlaylist(playlistId);
  console.log('Retrieved playlist', data.body);
}

async function getTracksInPlaylist(playlistId, offset, limit = 100) {
  // rate limit?
  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    limit,
    offset,
    fields: 'next,offset,total,items(track(id))',
  });

  return {
    trackIds: data.body.items.map(({ track: { id } }) => id),
    hasMore: !!data.body.next,
    offset: data.body.offset,
  };
}

async function trackExists(playlistId, trackId) {
  let offset = 0,
    hasMore = true,
    trackFound = false;
  while (hasMore && !trackFound) {
    const playlistTrackData = await getTracksInPlaylist(playlistId, offset);
    trackFound = playlistTrackData.trackIds.includes(trackId);
    hasMore = playlistTrackData.hasMore;
    offset = playlistTrackData.offset;
  }

  return trackFound;
}

async function addTrackToPlaylist(playlistId, trackUri) {
  console.log(`Adding track: ${trackUri}`);
  await requestSpotify(() => spotifyApi.addTracksToPlaylist(playlistId, [trackUri]));
  // TODO: handle error/success?
}

module.exports = {
  authorize,
  addTrackToPlaylist,
  trackExists,
  getPlaylists,
  AUTHORIZE_URL,
};
