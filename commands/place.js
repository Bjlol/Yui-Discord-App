const errors = require('./../errors.js'), utils = require('./../utils.js')

module.exports = {
    name: "place",
    execute: (msg, Discord, help) => {
      if(help) {
        var memberN = msg.member.nickname;
        if (memberN === null) memberN = msg.author.username;
        msg.channel.send(new Discord.RichEmbed().setTitle('Witaj, ' + memberN).addField('Użycie:', 'yui!place <czynnosc>').addField('Opis', 'Symuluje otoczenie!'))
      } else {
        let text = msg.content.substring('yui!place '.length);
        if(msg.member.hasPermission('MANAGE_ROLES') || utils.isOwner(msg.author.id)) {
        if(text.length > 1) {
        msg.channel.send(new Discord.RichEmbed().addField('Miejsce', `\`\`\`${msg.channel.name.replace(/-/g, ' ')}\`\`\``)
            .setColor('RANDOM').addField('Co się dzieje:', `\`\`\`${text}\`\`\``));
        } else {
          msg.channel.send('Pusto coś, dodaj argument!')
        }
        } else {
          msg.channel.send(errors.NoPerms)
        }
    }
    }
}