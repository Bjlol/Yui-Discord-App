const Discord = require('discord.js');


module.exports = {
    name: "admin_autorole",
    execute: (msg, Guilds) => {
        var role = msg.mentions.roles.first(), guildID = msg.channel.guild.id;
        if (role == null || role == undefined) {
            Guilds.update({ "autoroleEnabled": false, "autoroleId": null }, { where: { guildId: guildID } })
            msg.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle('Aktualizacja ustawień')
                .addField('Rola do automatycznego dawania :', 'Przywrócono domyślne'));
            Guilds.sync();
            return;
        }
        Guilds.update({ "autoroleEnabled": true, "autoroleId": role.id }, { where: { guildId: guildID } })
        msg.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle('Aktualizacja ustawień')
            .addField('Rola do automatycznego dawania :', `<@&${role}>`));
        Guilds.sync();
    }
}