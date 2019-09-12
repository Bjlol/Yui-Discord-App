let errors = require('./../errors.js'), utils = require('./../utils.js'), mentions = require('./../mention.js'),
  commands = require('./../commands.js'), StringReader = require('./../stringReader.js');

module.exports = {
  name: "unik",
  execute: (Yui, msg) => {
    let interpenter = new StringReader(msg.content.substring('yui!unik'.length)), chanceModififier = 0;
    let chance = interpenter.readInt();
    let help = chance == 'help' ? true : false;
    if (help) {
            msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj ${utils.getAuthorName(msg)}`).addField('Użycie komendy:', `\`yui!unik [modyfikator]\``)
        .addField('Opis', `Sprawdzam czy twój unik się udał`))
      return;
    }
    let okay = utils.genRandom(1, 40) + chance;
    if (okay < 20) {
      msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`).addField('Informacje:', `[${okay}] Niestety, unik się nie udał...`).setColor('RED'))
    } else {
      msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`).addField('Informacje:', `[${okay}] Twój unik się udał!`).setColor('GREEN'))
    }
  }
}