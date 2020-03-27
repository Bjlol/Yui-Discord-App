const utils = require('./../utils.js'), commands = require('./../commands.js'), gif_hug = require('./../data.js').hug;

module.exports = {
    name: "hug",
    execute: (msg, names, help) => {
        if (help) {
            msg.channel.send(commands.help.default('hug', names[0]));
            return;
        }
        let mention = utils.mentions(msg);
        if (!(mention.member)) msg.channel.send(commands.command.notOther('hug'));
        else msg.channel.send(utils.createGifEmbed(`${names[1]} został przytulony przez ${names[0]}`,
            gif_hug[utils.genRandom(0, gif_hug.length - 1)]));
    }
}
