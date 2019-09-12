const utils = require('./../utils.js'), mentions = require('./../mention.js'),
  commands = require('./../commands.js'), Discord = require('discord.js'), StringReader = require('./../stringReader.js');

module.exports = {
  name: "ping",
  execute: (Yui, msg) => {
    let interpenter = new StringReader(msg.content.substring('yui!ping'.length));
    if (interpenter.readWord() == 'help') msg.channel.send(new Discord.RichEmbed().setTitle('Witaj, ' + utils.getAuthorName(msg))
      .addField('Użycie:', 'yui!ping').addField('Opis', 'Sprawdzam swoją szybkość odpowiedzi!'))
    else msg.channel.send("Pong! Poczekaj chwilkę...").then((mess) => { mess.edit("Mój ping to: " + (Date.now() - msg.createdTimestamp)) });
  }
}