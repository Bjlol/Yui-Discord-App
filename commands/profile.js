const utils = require('./../utils.js'), mentions = require('./../mention.js'),
    commands = require('./../commands.js');

module.exports = {
    name: "profile",
    execute: (msg, memberN, Discord, levels, help) => {
        if (help) {
            msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj ${memberN}`).addField('Użycie komendy:',
                `\`yui!profile [oznaczenie]\``)
                .addField('Opis', `Pokazuje twój profil! Albo też kogoś innego...`))
            return;
        } else {
            var user = mentions(msg).member, memberM, id = msg.author.id;
            if (user) {
                id = msg.mentions.members.first().user.id;
                memberM = msg.mentions.members.first().nickname;
                if (memberM == null) memberM = msg.mentions.members.first().user.username;
            }
            levels.findOne({ where: { userId: id } }).then(userData => {
                let data;
                if (!userData) data = { xp: '0', lvl: '1' }
                else data = userData.dataValues;
                let embed = new Discord.RichEmbed().addField(`${data.lvl} - Poziom`, `${data.xp} - XP`).setColor('RANDOM')
                if (!user) embed.setTitle(`Witaj ${memberN}`);
                else embed.setTitle(`Witaj ${memberN}, o to profil gracza ${memberM}`);
                msg.channel.send(embed)
            })
        }

    }
}