const express = require('express');
const spotify = require('./spotify');
const { telegramCallback } = require('./telegram');

// express setup
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(telegramCallback);

app.get('/spotify/auth', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    console.error('Failed to get authorization code from Spotify');
  }

  await spotify.authorize(code);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
