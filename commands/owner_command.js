let errors = require('./../errors.js')

module.exports = {
    name: "owner_command",
    execute: (msg, Yui) => {
        if (Yui.hasPermission('MANAGE_MESSAGES', false, true)) {
            let text = msg.content.substring('yui!command '.length);
            msg.channel.send(text).then(msg.delete(0));
        } else {
            msg.channel.send(errors.CantDelete);
            return;
        }
    }
}