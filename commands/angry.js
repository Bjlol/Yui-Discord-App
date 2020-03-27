const utils = require('./../utils.js'), commands = require('./../commands.js'), gif_angry = require('./../data.js').angry;

module.exports = {
    name: "angry",
    execute: (msg, names, help) => {
        if (help) {
            msg.channel.send(commands.help.default('angry', names[0]));
            return;
        }
        let mention = utils.mentions(msg);
        if (!(mention.member)) msg.channel.send(commands.command.notOther('angry'));
            else msg.channel.send(utils.createGifEmbed(`${names[0]} jest zly na ${names[1]}`, gif_angry[utils.genRandom(0, gif_angry.length - 1)]));
    }
}