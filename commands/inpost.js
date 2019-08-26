const https = require('https'), command = require('./../commands').help;

module.exports = {
    name: "inpost",
    execute: (msg, arg, help) => {
        if (help) {
            msg.channel.send(command.inpost.help(arg[1]));
            return;
        }
        if (arg[0].length > 24) {
            msg.channel.send(command.inpost.too_long());
        }
    }
}