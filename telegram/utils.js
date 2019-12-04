function getBotCommandArg(commandName, msg) {
  const commandParts = msg.split(commandName + ' ');
  return commandParts[1];
}

module.exports = {
  getBotCommandArg,
};
