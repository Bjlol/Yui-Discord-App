const utils = require('./../utils.js'), commands = require('./../commands.js'), gif_smile = require('./../data.js').smile;

module.exports = {
    name: "smile",
    execute: (msg, names, help) => {
        if (help) {
            msg.channel.send(commands.help.default('smile', names[0]));
            return;
        }
        let mention = utils.mentions(msg);
        if (!(mention.member)) msg.channel.send(commands.command.notOther('smile'));
            else msg.channel.send(utils.createGifEmbed(`${names[0]} uśmiechnął się do ${names[1]}`, gif_smile[utils.genRandom(0, gif_smile.length - 1)]));
    }
}
