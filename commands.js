const Discord = require('discord.js');

module.exports = {
  command: {
        giphy : { notSelf: new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy:', '`yui!giphy <tag>`') },
        cry : { notEveryone: new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy:', '`yui!cry [osoba]`')},
        kill : { notEveryone: new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy', '`yui!kill [osoba]`')},
        cookie : { notSelf: new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy', '`yui!cookie [osoba/everyone]`')},
        cat : { notSelf: new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy', '`yui!cat`')},
        lyrics : { notSelf: new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy', '`yui!lyrics <tytul>`')},
        notOther: (command) => new Discord.RichEmbed().setTitle('Coś nie tak!').addField('Użycie komendy:', `\`yui!${command} <osoba>\``)
    },
    help: {
        default: (command, username) => new Discord.RichEmbed().setTitle(`Witaj ${username}`).addField('Użycie komendy:', `\`yui!${command} <osoba>\``),
        otherNotRequired: (command, username) => new Discord.RichEmbed().setTitle(`Witaj ${username}`).addField('Użycie komendy:', `\`yui!${command} [osoba]\``),
        cookie: (username) => new Discord.RichEmbed().setTitle(`Witaj ${username}`).addField('Użycie komendy:', `\`yui!cookie [osoba/everyone]\``)
    }
}