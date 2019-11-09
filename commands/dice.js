const utils = require('./../utils.js'), mentions = require('./../mention.js'),
  commands = require('./../commands.js'), Discord = require('discord.js'), StringReader = require('./../stringReader.js');

module.exports = {
  name: "dice",
  execute: (Yui, msg) => {
    let interpenter = new StringReader(msg.content.substring('yui!dice'.length)), sub = [], maks = 6, name = utils.getAuthorName(msg);
    sub[0] = interpenter.readWord();
    if (sub[0] == 'help') {
      msg.channel.send(new Discord.RichEmbed().setTitle('Witaj, ' + name).addField('Użycie:', 'yui!dice [maksymalna]').addField('Opis', 'Rzucam za ciebie kostką!'))
    } else {
      if (sub[0] != undefined) {
        if (parseInt(sub[0]) != NaN) maks = parseInt(sub[0]);
      }
      let number = utils.genRandom(1, maks);
      msg.channel.send(new Discord.RichEmbed().setTitle('Witaj ' + name).setColor('RANDOM').addField('Rzuciłeś kostką!', `Wyrzuciłeś ${number}`))
    }
  }
}