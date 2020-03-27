const utils = require('./../utils.js'), commands = require('./../commands.js'), StringReader = require('./../stringReader.js'),
    errors = require('./../errors.js');

module.exports = {
    name: "profile",
    execute: (Yui, msg) => {
        let interpenter = new StringReader(msg.content.substring('yui!profile'.length));
        let help = interpenter.readWord() == 'help'? true : false;
        if (help) {
            msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj ${utils.getAuthorName(msg)}`).addField('Użycie komendy:',
                `\`yui!profile [oznaczenie]\``)
                .addField('Opis', `Pokazuje twój profil! Albo też kogoś innego...`))
            return;
        } else {
            var user = utils.mentions(msg).member, memberM, id = msg.author.id;
            Yui.levels.findOne({ where: { userId: id } }).then(userData => {
                let data;
                if (!userData) data = { xp: '0', lvl: '1' }
                else data = userData.dataValues;
                let embed = new Discord.RichEmbed().addField(`${data.lvl} - Poziom`, `${data.xp} - XP`).setColor('RANDOM')
                if (!user) embed.setTitle(`Witaj ${utils.getAuthorName(msg)}`);
                else embed.setTitle(`Witaj ${utils.getAuthorName(msg)}, o to profil gracza ${utils.getMentionedName(msg)}`);
                msg.channel.send(embed)
            })
        }

    }
}
