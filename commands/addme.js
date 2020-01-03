const utils = require('./../utils.js'), data = require('./../data.js')
commands = require('./../commands.js'), StringReader = require('./../stringReader.js'),
  errors = require('./../errors.js');
module.exports = {
  name: "addme",
  execute: (Yui, msg) => {
    let interpenter = new StringReader(msg.content.substring('yui!addme').length)
    if (!interpenter.canRead()) {
      msg.channel.send('https://discordapp.com/api/oauth2/authorize?client_id=551414888199618561&scope=bot&permissions=8');
    } else {
      if (interpenter.readWord() == 'help') msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`)
        .addField('Użycie:', 'yui!addne').addField('Opis', 'Wysyłam ci link żebyś mógł mnie zaprosić na serwer!'))
    }
  }
}