module.exports = {
    name: "servers",
    execute: (msg, Discord) => {
        msg.channel.send(new Discord.RichEmbed().setTitle('Sword Art Online RP').addField('Zaproszenie :', 'https://discord.gg/wHWjEsA')
            .addField('Mój drugi domek!', 'PS. Jestem tam jedynym botem!').setColor('RANDOM'));
        msg.channel.send(new Discord.RichEmbed().setTitle('KRD.Online').addField('Zaproszenie :', 'https://discord.gg/wHWjEsA')
            .addField('Discord serwera Minecraft', 'PS. Pracuje tam mój kolega (KRD.Bot)').setColor('RANDOM'));
    }
}