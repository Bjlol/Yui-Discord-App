const utils = require('./../utils.js'), mentions = require('./../mention.js'),
    commands = require('./../commands.js'), https = require('https'), Discord = require('discord.js');

module.exports = {
  name: "lyrics",
  execute: (msg, title) => {
    let mention = mentions(msg);
    if (!mention.self) {
      msg.channel.send(commands.command.lyrics.notSelf);
      return;
    } else {
                let headers = {
                    hostname: "https://some-random-api.ml",
                    path: `/lyrics?title=${title}`
                }
                https.get(`https://some-random-api.ml/lyrics?title=${title}`,response => {
                    let responseText = '';
                    response.on('data', chunk => { if (chunk) responseText += chunk; })
                    response.on('end', () => { 
                      responseText = JSON.parse(responseText);
                      if(responseText.lyrics) {
                      msg.channel.send(new Discord.RichEmbed().setTitle('Znaleziona piosenka: ')
                                       .addField('Tytuł: ', responseText.title).addField('Autor: ', responseText.author)
                                       .setThumbnail(responseText.thumbnail.genius).setColor('RANDOM').setFooter(`Źródło: ${responseText.links.genius}`));
                      let textEmbed = new Discord.RichEmbed().setTitle('Tekst: ').setColor('RANDOM');
                      let voices = responseText.lyrics.match(/([\[]\w+.+[\s|\]]\n)+/g);
                      let text = responseText.lyrics.split(/([\[]\w+.+[\s|\]]\n)+/g).map(elt => elt.replace(/([\[]\w+.+[\s|\]]\n)+/g, '===========')).filter(elt => elt);
                      if(voices || text) {
                      for(let i = 0; i < text.length; i++) textEmbed.addField(voices[i], text[i]);
                      msg.channel.send(textEmbed)
                      } else {
                        msg.channel.send(textEmbed.addField('Coś nie tak albo nie umiem czytać ale proszę:', responseText.lyrics))
                      }
                      } else {
                        msg.channel.send('Wygląda na to że ktoś odciął mi połączenie z internetem albo po prostu nie mogę tego znaleźć... Shift happens')
                      }
                    }
                )})
    }
  }
}