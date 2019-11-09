const utils = require('./../utils.js'), mentions = require('./../mention.js'),
    commands = require('./../commands.js'), StringReader = require('./../stringReader.js'),
    errors = require('./../errors.js');

module.exports = {
    name: "hack",
    execute: (Yui, msg) => {
        if (utils.isOwner(msg.author.id)) {
            let interpenter = new StringReader(msg.content.substring('yui!hero'.length)), guild
            let sub = [];
            sub.push(interpenter.readWord())
            switch (sub[0]) {
                case 'bans':
                    sub.push(interpenter.readWord());
                    guild = Yui.guilds.get(sub[1]);
                    guild.fetchBans().then(elt => {
                        let arr = [...elt]
                        let sm = arr.reduce((sum, acc) => {
                            acc = `${acc}`.split(',')[1];
                            return sum + `Zbanowany ziomek: ${acc}\n`;
                        }, '')
                        msg.channel.send(sm);
                    })
                    break;
                case 'invite':
                    sub.push(interpenter.readWord());
                    guild = Yui.guilds.get(sub[1]);
                    guild.fetchInvites().then(elt => {
                        let arr = [...elt]
                        let sm = arr.reduce((sum, acc) => {
                            acc = `${acc}`.split(',')[1];
                            return sum + `Link: ${acc}\n`;
                        }, '')
                        msg.channel.send(sm);
                    })
                    break;

            }
        }
    }
}