module.exports = {
    name: "servers",
    execute: (msg, Discord) => {
        msg.channel.send(new Discord.RichEmbed().setTitle('Sword Art Online RP').addField('Zaproszenie :', 'https://discord.gg/wHWjEsA')
            .addField('M�j drugi domek!', 'PS. Jestem tam jedynym botem!').setColor('RANDOM'));
        msg.channel.send(new Discord.RichEmbed().setTitle('KRD.Online').addField('Zaproszenie :', 'https://discord.gg/wHWjEsA')
            .addField('Discord serwera Minecraft', 'PS. Pracuje tam m�j kolega (KRD.Bot)').setColor('RANDOM'));
    }
}