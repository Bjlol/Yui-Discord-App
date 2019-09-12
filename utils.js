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
    },
    getStatus: (status) => {
        switch (status) {
            case 0: return 'W trakcie pisania';
            case 1: return 'Wysłane do sprawdzenia';
            case 2: return 'Odrzucone';
            case 3: return 'Zaakceptowana';
        }
    },
    getAuthorName(msg) {
        let memberN = msg.member.nickname;
        if (memberN === null) memberN = msg.author.username;
        return memberN;
    },
    getMentionedName(msg) {
        let memberMentionedName = msg.mentions.members.first().nickname;
        if (memberMentionedName == null) memberMentionedName = msg.mentions.members.first().user.username;
        return memberMentionedName;
    }

}