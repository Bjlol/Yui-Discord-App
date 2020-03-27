const utils = require('./../utils.js'), commands = require('./../commands.js'), gif_cheer = require('./../data.js').cheer;

module.exports = {
    name: "cheer",
    execute: (msg, names, help) => {
        if (help) {
            msg.channel.send(commands.help.default('cheer', names[0]));
            return;
        }
        let mention = utils.mentions(msg);
        if (!(mention.member)) msg.channel.send(commands.command.notOther('cheer'));
        else msg.channel.send(utils.createGifEmbed(`${names[1]} pociesza ${names[0]}!`, gif_cheer[utils.genRandom(0, gif_cheer.length - 1)]));
    }
}