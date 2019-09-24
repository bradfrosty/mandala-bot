const Telegraf = require('telegraf');
const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => ctx.reply('Hello world!'));
bot.hears('musica', ctx => ctx.reply('send me da music'));
bot.hears(/(https:\/\/open.spotify.com\/track\/|spotify:track:)([a-zA-Z0-9]+)/, ctx => {
  console.log('got a spotify link', ctx.message, ctx.editedMessage);
  console.log(ctx.message, ctx.match);
  if (ctx && ctx.match && ctx.match[0]) {
    ctx.reply('got your link ' + ctx.match[0]);
  }
});
bot.launch();