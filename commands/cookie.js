const utils = require('./../utils.js'), commands = require('./../commands.js'), gif_cookie = require('./../data.js').cookie;

module.exports = {
  name: "cookie",
  execute: (msg, names, help) => {
    if (help) {
      msg.channel.send(commands.help.cookie(names[0]))
      return;
    }

    let mention = utils.mentions(msg);

    if (mention.self) {
      msg.channel.send(commands.command.cookie);
      return;
    }
    if (mention.everyone) msg.channel.send(utils.createGifEmbed('Ciasteczka dla wszystkich!', gif_cookie[utils.genRandom(0, gif_cookie.length - 1)]));
    else msg.channel.send(utils.createGifEmbed("", null).addField(`${names[1]} dostal ciasteczko od ${names[0]}`, 'UwU (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ :cookie:'));
  }
}
