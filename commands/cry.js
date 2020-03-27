const utils = require('./../utils.js'), commands = require('./../commands.js'), gif_cry = require('./../data.js').cry;

module.exports = {
  name: "cry",
  execute: (msg, names, help) => {
    if (help) {
      msg.channel.send(commands.help.otherNotRequired("cry", names[0]))
      return;
    }

    let mention = utils.mentions(msg);

    if (mention.everyone) {
      msg.channel.send(commands.command.cry)
      return;
    }

    if (mention.self) {
      msg.channel.send(utils.createGifEmbed(`${names[0]} płacze`, gif_cry[utils.genRandom(0, gif_cry.length - 1)]));
    } else {
      msg.channel.send(utils.createGifEmbed(`${names[0]} płacze przez ${names[1]}`, gif_cry[utils.genRandom(0, gif_cry.length - 1)]));
    }
  }
}
