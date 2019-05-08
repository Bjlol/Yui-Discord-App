const Discord = require('discord.js');

module.exports = {
    name: "admin_verify",
    execute: (msg, Guilds) => {
        var role = msg.mentions.roles.first(), guildID = msg.channel.guild.id;
        if (role == null || role == undefined) {
            Guilds.update({ "verifyEnabled": false, "verifyRoleId": role }, { where: { guildId: guildID } })
            msg.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle('Aktualizacja ustawień')
                .addField('Rola dawana po przejściu weryfikacji :', 'Przywrócono domyślne'));
            return;
        }
        Guilds.update({ "verifyEnabled": true, "verifyRoleId": role.id }, { where: { guildId: guildID } })
        msg.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle('Aktualizacja ustawień')
            .addField('Rola dawana po przejściu weryfikacji :', `<@&${role}>`));
        Guilds.sync();
    }
}