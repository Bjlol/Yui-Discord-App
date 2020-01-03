const utils = require('./../utils.js'), commands = require('./../commands.js'), gif_pat = require('./../data.js').pat;

module.exports = {
    name: "pat",
    execute: (msg, names, help) => {
        if (help) {
            msg.channel.send(commands.help.default('pat', names[0]));
            return;
        }
        let mention = utils.mentions(msg);
        if (!(mention.member)) msg.channel.send(commands.command.notOther('pat'));
            else msg.channel.send(utils.createGifEmbed(`${names[0]} glaszcze ${names[1]}`, gif_pat[utils.genRandom(0, gif_pat.length - 1)]));
    }
}