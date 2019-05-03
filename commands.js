const Discord = require('discord.js');

module.exports = {
  command: {
    giphy : { notSelf: new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy:', '`yui!giphy <tag>`') },
    cry : { notEveryone: new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy:', '`yui!giphy [osoba]`')},
    kill : { notEveryone: new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy', '`yui!kill [osoba]`')},
    cookie : { notSelf: new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy', '`yui!cookie [osoba/everyone]`')},
    cat : { notSelf: new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy', '`yui!cat`')},
    notOther: (command) => new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy:', `\`yui!${command} <osoba>\``)
  },
}