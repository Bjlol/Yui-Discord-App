const utils = require('./../utils.js'), data = require('./../data.js'), commands = require('./../commands.js'),
  Discord = require('discord.js'), StringReader = require('./../stringReader.js'), errors = require('./../errors.js');

module.exports = {
  name: "ship",
  execute: (Yui, msg) => {
    let interpenter = new StringReader(msg.content.substring('yui!ship'.length)), sub = [];
    sub[0] = interpenter.readWord();
    if (sub[0] == 'help') msg.channel.send(new Discord.RichEmbed().setTitle('Witaj, ' + utils.getAuthorName(msg)).addField('Użycie:', 'yui!ship <osoba> <2 osoba>')
      .addField('Opis', 'Sprawdzam dopasowanie!'))
    else {
      if (sub[0] == undefined) {
        msg.channel.send(errors.KillMe);
        return;
      }
      sub[1] = interpenter.readWord();
      if (sub[1] == undefined) {
        msg.channel.send(errors.KillMe);
        return;
      }
      let randomNumber = (process.env.SECRET.length * sub[0].length * sub[1].length) % 100 + 1, answer;
      if (randomNumber >= 0 && randomNumber < 20) answer = data.ship[0];
      if (randomNumber >= 20 && randomNumber < 40) answer = data.ship[1];
      if (randomNumber >= 40 && randomNumber < 60) answer = data.ship[2];
      if (randomNumber >= 60 && randomNumber < 80) answer = data.ship[3];
      if (randomNumber >= 80 && randomNumber < 100) answer = data.ship[4];
      if (randomNumber == 100) answer = ':heart: Też tak uważam :heart:';
      msg.channel.send(`:heart: Sprawdzam :heart: \n - ${sub[0]} \n - ${sub[1]} \n${randomNumber}% - ${answer}`);
    }
  }
}