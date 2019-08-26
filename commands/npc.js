const errors = require('./../errors.js'), utils = require('./../utils.js')

module.exports = {
    name: "npc",
    execute: (msg, Discord, help) => {
      if(help) {
        var memberN = msg.member.nickname;
        if (memberN === null) memberN = msg.author.username;
        msg.channel.send(new Discord.RichEmbed().setTitle('Witaj, ' + memberN).addField('Użycie:', 'yui!npc <imie/nazwa> <czynność>').addField('Opis', 'Wysyłam ładnego embeda udając npc!'))
      } else {
        if(msg.member.hasPermission('MANAGE_ROLES') || utils.isOwner(msg.author.id)) {
        var msgContent = msg.content.substring('yui!npc '.length);
        var args = msgContent.split(' '), number = parseInt(args[0]),
            whoText = args.slice(1, number + 1).join(" "),
            text = args.slice(1 + number).join(" ");
        if(whoText.length > 1 || text.length > 1) {
        msg.channel.send(new Discord.RichEmbed()
            .addField('NPC :', `\`\`\`${whoText}\`\`\``)
            .addField('Czynność :', `\`\`\`${text}\`\`\``)
            .setColor('RANDOM'));
        } else {
          msg.channel.send('Pusto coś, dodaj argument!')
        }
        } else {
          msg.channel.send(errors.NoPerms)
        }
    }
    }
}