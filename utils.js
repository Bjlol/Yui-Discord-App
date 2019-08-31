const Discord = require('discord.js');

module.exports = {
    genRandom: (min, max) => { return Math.floor(Math.random() * (+max - +min)) + +min; },
    createGifEmbed: (title, gif) => { return new Discord.RichEmbed().setTitle(title).setColor('RANDOM').setImage(gif); },
    createGifEmbedWithColor: (title, gif, color) => { return new Discord.RichEmbed().setTitle(title).setColor(color).setImage(gif); },
    isOwner: (id) => { return id == 344048874656366592 },
    getGDT: (guildId) => {
        return {
            guildId: guildId, fields: JSON.stringify([]), Shop: JSON.stringify({}),
            config: JSON.stringify({
                max: 3, chatChannel: null,
                atackScalling: 10, atackBase: 40,
                startingBalance: 0
            }),
            Messages: JSON.stringify({ ApproveMess: null, DeclineMess: null }),
            MoneySystem: false, XPSystem: false, rpEnabled: false
        }
    }

}