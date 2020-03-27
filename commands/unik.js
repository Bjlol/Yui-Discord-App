const commands = require('./../commands.js'), utils = require('./../utils.js'), errors = require('./../errors.js')

module.exports = {
    name: "unik",
    execute: (msg, chanceModififier = 0,Discord, name, help) => {
      if(help) {
        msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj ${name}`).addField('Użycie komendy:', `\`yui!unik [modyfikator]\``)
                         .addField('Opis', `Sprawdzam czy twój unik się udał` ))
      } else {
       let okay = utils.genRandom(1, 40);
      if(chanceModififier != 0) {
          okay += parseInt(chanceModififier);
      }
      if(okay < 20) {
        msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${name}`).addField('Informacje:', `[${okay}] Niestety, unik się nie udał...`).setColor('RED'))
      } else {
        msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${name}`).addField('Informacje:', `[${okay}] Twój unik się udał!`).setColor('GREEN'))
      }
    }
    }
}
