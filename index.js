const Telegraf = require('telegraf');
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

// express setup
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/spotify/auth', (req, res) => {
  console.log('spot auth', req.query);
  const code = req.query.code;

  if (!code) {
    console.error('fail');
  }

  spotifyApi.authorizationCodeGrant(code).then(
    function(data) {
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      console.log('The refresh token is ' + data.body['refresh_token']);

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      res.sendStatus(200);
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// spotify setup
console.log(
  process.env.BOT_TOKEN,
  process.env.SPOTIFY_CLIENT_ID,
  process.env.SPOTIFY_CLIENT_SECRET
);

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/spotify/auth',
});

const authorizeURL = spotifyApi.createAuthorizeURL(['playlist-read-collaborative']);

const bot = new Telegraf(process.env.BOT_TOKEN);
const PLAYLISTS = {};

function getBotCommandArg(commandName, msg) {
  const commandParts = msg.split(commandName);
  return commandParts[1];
}

bot.start(ctx => ctx.reply('Hello world!'));
bot.command('playlist', ctx => {
  const chatId = ctx.chat.id;
  console.log(ctx.message);
  const playlistId = getBotCommandArg('playlist', ctx.message.text);
  PLAYLISTS[chatId] = playlistId;
  ctx.reply(`Set chat playlist to ${playlistId} for chat:${chatId}`);
});
bot.hears('musica', ctx => ctx.reply('send me da music'));
bot.hears(/(https:\/\/open.spotify.com\/track\/|spotify:track:)([a-zA-Z0-9]+)/, ctx => {
  if (ctx && ctx.match && ctx.match[0]) {
    const playlistId = PLAYLISTS[ctx.chat.id];
    console.log('getting playlist ' + playlistId);
    spotifyApi.getPlaylist(playlistId).then(
      function(data) {
        console.log('Retrieved playlist', JSON.stringify(data.body));
      },
      function(err) {
        console.log('Something went wrong!', err);
        ctx.reply('Spotify not logged in. Login with this link and try again!');
        ctx.reply(authorizeURL);
      }
    );

    ctx.reply('got your link ' + ctx.match[0]);
  }
});
bot.launch();
