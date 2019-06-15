const utils = require('./../utils.js'), mentions = require('./../mention.js'),
    commands = require('./../commands.js'), gif_kiss = require('./../data.js').kiss;

module.exports() = {
    name: "kiss",
    execute: (msg, names, help) => {
        if (help) {
            msg.channel.send(commands.help.default('kiss', names[0]));
            return;
        }
        let mention = mentions(msg);
        if (!(mention.member)) msg.channel.send(commands.command.notOther('kiss'));
        else msg.channel.send(utils.createGifEmbed(`${names[0]} został pocałowany przez ${names[1]}`,
             gif_kiss[utils.genRandom(0, gif_kiss.length - 1)]));
    }
}