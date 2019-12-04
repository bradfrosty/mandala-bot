const Telegraf = require('telegraf');
const commands = require('./commands');
const listeners = require('./listeners');
const { BOT_TOKEN, TELEGRAM_WEBHOOK_HOST } = require('../constants');
const bot = new Telegraf(BOT_TOKEN);
const WEBHOOK_PATH = 'telegram';
bot.telegram.setWebhook(`${TELEGRAM_WEBHOOK_HOST}/${WEBHOOK_PATH}`);
bot.start(ctx => ctx.reply('Hello world!'));
commands.init(bot);
listeners.init(bot);
bot.launch();

const telegramCallback = bot.webhookCallback(WEBHOOK_PATH);

module.exports.telegramCallback = telegramCallback;
