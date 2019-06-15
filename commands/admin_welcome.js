const Discord = require('discord.js');

module.exports = {
    name: "admin_welcome",
    execute: (Guilds, msg, message) => {
        if (message == null || message == undefined) {
            msg.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle('Aktualizacja ustawień')
                .addField('Kanał do wysyłania wiadomości :', 'Przywrócono domyślne').addField('Wiadomość :', 'Przywrocono domyślne'));
            Guilds.update({ "welcomeEnabled": false, "welcomeChannel": null, "welcomeMessage": null }, { where: { guildId: guildID } })
            return;
        }
        var channel = msg.mentions.channels.first().id;
        msg.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle('Aktualizacja ustawień')
            .addField('Kanał do wysyłania wiadomości :', `<#${channel}>`).addField('Wiadomość :', message));
        message = encodeURI(message);
        Guilds.update({ "welcomeEnabled": true, "welcomeChannel": channel, "welcomeMessage": message }, { where: { guildId: guildID } });
        Guilds.sync();
    }
}