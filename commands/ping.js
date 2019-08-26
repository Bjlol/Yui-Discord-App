const Discord = require('discord.js');

module.exports = {
    name: "ping",
    execute: (msg, help) => {
      if(help) {
        var memberN = msg.member.nickname;
        if (memberN === null) memberN = msg.author.username;
        msg.channel.send(new Discord.RichEmbed().setTitle('Witaj, ' + memberN).addField('Użycie:', 'yui!ping').addField('Opis', 'Sprawdzam swoją szybkość!'))
      } else {
        msg.channel.send("Pong! Poczekaj chwilkę...")
        .then((mess) => { mess.edit("Mój ping to: " + (Date.now() - msg.createdTimestamp)) });
      }
    }
}