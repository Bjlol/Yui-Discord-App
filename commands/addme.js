const Discord = require('discord.js');

module.exports = {
    name: "addme",
    execute: (msg, help) => {
        if(help) {
          var memberN = msg.member.nickname;
        if (memberN === null) memberN = msg.author.username;
          msg.channel.send(new Discord.RichEmbed().setTitle('Witaj, ' + memberN).addField('Użycie:', 'yui!addne').addField('Opis', 'Wysyłam ci link żebyś mógł mnie zaprosić na serwer!'))
        } else {
        msg.channel.send('https://discordapp.com/api/oauth2/authorize?client_id=551414888199618561&scope=bot&permissions=8');
        }
    }
}