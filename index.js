const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => ctx.reply('Hello world!'));
bot.hears('musica', ctx => ctx.reply('send me da music'));
bot.launch();