const utils = require('./../utils.js'), commands = require('./../commands.js'), gif_slap = require('./../data.js').slap;

module.exports = {
    name: "slap",
    execute: (msg, names, help) => {
        if (help) {
            msg.channel.send(commands.help.default('slap', names[0]));
            return;
        }
        let mention = utils.mentions(msg);
        if (!(mention.member)) msg.channel.send(commands.command.notOther('slap'));
        else msg.channel.send(utils.createGifEmbed(`${names[1]} został uderzony przez ${names[0]}`,
            gif_slap[utils.genRandom(0, gif_slap.length - 1)]));
    }
}
