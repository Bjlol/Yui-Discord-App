const utils = require('./../utils.js'), data = require('./../data.js'),
  commands = require('./../commands.js'), StringReader = require('./../stringReader.js'),
  errors = require('./../errors.js'), https = require('https');

module.exports = {
  name: "lyrics",
  execute: (Yui, msg) => {
    let interenter = new StringReader(msg.content.substring('yui!lyrics'.length))
    interenter.skipSpaces();
    let title = interenter.getRemaing();
    if (title == 'help') {
      msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`)
        .addField('Użycie:', 'yui!lyrics').addField('Opis', 'Pokazuje ci tekst piosenki na podstawie tytułu!'))
      return;
    }
    https.get(`https://some-random-api.ml/lyrics?title=${interenter.getRemaing()}`, response => {
      let responseText = '';
      response.on('data', chunk => { if (chunk) responseText += chunk; })
      response.on('end', () => {
        responseText = JSON.parse(responseText);
        if (responseText.lyrics) {
          msg.channel.send(new Yui.Discord.RichEmbed().setTitle('Znaleziona piosenka: ')
            .addField('Tytuł: ', responseText.title).addField('Autor: ', responseText.author)
            .setThumbnail(responseText.thumbnail.genius).setColor('RANDOM').setFooter(`Źródło: ${responseText.links.genius}`));
          let textEmbed = new Yui.Discord.RichEmbed().setTitle('Tekst: ').setColor('RANDOM');
          let voices = responseText.lyrics.match(/([\[]\w+.+[\s|\]]\n)+/g);
          let text = responseText.lyrics.split(/([\[]\w+.+[\s|\]]\n)+/g).map(elt => elt.replace(/([\[]\w+.+[\s|\]]\n)+/g, '===========')).filter(elt => elt);
          if (voices || text) {
            for (let i = 0; i < text.length; i++) {
              if(i % 25 == 0) {
                msg.channel.send(textEmbed)
                textEmbed = new Yui.Discord.RichEmbed().setTitle('Tekst').setColor('RANDOM')
              }
              textEmbed.addField(`Linia: ${i % 25 + 1}`, text[i]);
            }
            msg.channel.send(textEmbed)
          } else {
            msg.channel.send(textEmbed.addField('Coś nie tak albo nie umiem czytać ale proszę:', responseText.lyrics))
          }
        } else {
          msg.channel.send('Wygląda na to że ktoś odciął mi połączenie z internetem albo po prostu nie mogę tego znaleźć... Shift happens')
        }
      }
      )
    })
  }
}
