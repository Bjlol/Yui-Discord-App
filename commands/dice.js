const utils = require('./../utils.js'), mentions = require('./../mention.js'),
    commands = require('./../commands.js');

module.exports = {
    name: "dice",
    execute: (msg, maks = 6,Discord, help) => {
      var memberN = msg.member.nickname;
        if (memberN === null) memberN = msg.author.username;
      if(help) {
        msg.channel.send(new Discord.RichEmbed().setTitle('Witaj, ' + memberN).addField('Użycie:', 'yui!dice [maksymalna]').addField('Opis', 'Rzucam za ciebie kostką!'))
      } else {
        let number = utils.genRandom(1, maks);
        msg.channel.send(new Discord.RichEmbed().setTitle('Witaj ' + memberN).setColor('RANDOM').addField('Rzuciłeś kostką!', `Wyrzuciłeś ${number}`))
      }
    }
}