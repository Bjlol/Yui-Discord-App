const utils = require('./../utils.js'), commands = require('./../commands.js'), Discord = require('discord.js'),
  StringReader = require('./../stringReader.js');

module.exports = {
  name: "dice",
  execute: (Yui, msg) => {
    let interpenter = new StringReader(msg.content.substring('yui!dice'.length)), sub = [],min = 1, maks = 6, name = utils.getAuthorName(msg);
    sub[0] = interpenter.readWord();
    if (sub[0] == 'help') {
      msg.channel.send(new Discord.RichEmbed().setTitle('Witaj, ' + name).addField('Użycie:', 'yui!dice [maksymalna] [dolny próg]').addField('Opis', 'Rzucam za ciebie kostką!'))
    } else {
      if (sub[0] != undefined) {
        if (parseInt(sub[0]) != NaN) maks = parseInt(sub[0]);
        sub[1] = interpenter.readWord();
        if (sub[1] != undefined) {
          if (parseInt(sub[1]) != NaN) min = parseInt(sub[1]);
        }
      }
      let number = utils.genRandom(min, maks + 1);
      msg.channel.send(new Discord.RichEmbed().setTitle('Witaj ' + name).setColor('RANDOM').addField('Rzuciłeś kostką!', `Wyrzuciłeś ${number}`))
    }
  }
}
