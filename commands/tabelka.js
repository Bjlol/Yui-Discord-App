let errors = require('./../errors.js')

module.exports = {
    name: "tabelka",
    execute: (msg, number) => {
        if (number > 50) {
            msg.channel.send(errors.KillMe);
            return;
        }
        for (var x = 0; x < value; x++) { msg.channel.send('``` ```') }
    }
}