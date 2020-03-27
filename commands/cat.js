const utils = require('./../utils.js'), commands = require('./../commands.js'),
  https = require('https'), Discord = require('discord.js');

module.exports = {
  name: "cat",
  execute: (msg, names, help) => {
    if (help) {
      var memberN = msg.member.nickname;
      if (memberN === null) memberN = msg.author.username;
      msg.channel.send(new Discord.RichEmbed().setTitle('Witaj, ' + memberN).addField('Użycie:', 'yui!cat ').addField('Opis', 'Wysyłam ci zdjecie kotka!'))
    } else {
      let mention = utils.mentions(msg);

      if (!mention.self) {
        msg.channel.send(commands.command.cat.notSelf);
        return;
      }
      else {
        let headers = {
          hostname: "api.thecatapi.com",
          path: "/v1/images/search?order=RANDOM&limit=1",
          headers: { 'x-api-key': process.env.CatApiKey }
        }
        https.get(headers, response => {
          let responseText = '';
          response.on('data', chunk => { if (chunk) responseText += chunk; })
          response.on('end', () => { msg.channel.send(utils.createGifEmbed(`O to koteczek dla ciebie, ${names}`, JSON.parse(responseText)[0].url)); })
        })
      }
    }
  }
}