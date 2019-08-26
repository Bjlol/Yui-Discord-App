const errors = require('./../errors.js'), data = require('./../data.js'), Discord = require('discord.js');

module.exports = {
    name: "ship",
    execute: (msg, args, help) => {
      if(help) {
        var memberN = msg.member.nickname;
        if (memberN === null) memberN = msg.author.username;
        msg.channel.send(new Discord.RichEmbed().setTitle('Witaj, ' + memberN).addField('Użycie:', 'yui!ship <1 imie> <2 imie>').addField('Opis', 'Sprawdzam dopasowanie!'))
      } else {
        let ships = data.ship
        if (args[0] === undefined || args[1] === undefined) {
            msg.channel.send(errors.AirShip);
            return;
        }
        let randomNumber = (process.env.SECRET.length * args[0].length * args[1].length) % 100, answer;
        if (randomNumber >= 0 && randomNumber < 20) answer = ships[0];
        if (randomNumber >= 20 && randomNumber < 40) answer = ships[1];
        if (randomNumber >= 40 && randomNumber < 60) answer = ships[2];
        if (randomNumber >= 60 && randomNumber < 80) answer = ships[3];
        if (randomNumber >= 80 && randomNumber < 100) answer = ships[4];
        if (randomNumber == 100) answer = ':heart: Też tak uważam :heart:';

        msg.channel.send(`:heart: Sprawdzam :heart: \n - ${args[0]} \n - ${args[1]} \n${randomNumber}% - ${answer}`);}
    }
}