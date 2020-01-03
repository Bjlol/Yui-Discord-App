let errors = require('./../errors.js'), yandex = require('yandex-translate')(process.env.YandexApiKey),
    utils = require('./../utils.js'), commands = require('./../commands.js'), StringReader = require('./../stringReader.js');
module.exports = {
    name: "translate",
    execute: (Yui, msg) => {
        let memberN = utils.getAuthorName(msg), interpenter = new StringReader(msg.content.substring('yui!translate'.length)), sub = [];
        sub[0] = interpenter.readWord();
        if (sub[0] == 'help') msg.channel.send(new Yui.Discord.RichEmbed().setTitle('Witaj, ' + memberN)
            .addField('Użycie:', 'yui!translate <język docelowy> <text>').addField('Opis', 'Bawię się w tłumacza!'))
        else {
            let lang = sub[0];
            interpenter.skipSpaces();
            let text = interpenter.getRemaing();
            yandex.detect(text, (_err, res) => {
                var baseLang = res.lang;
                yandex.translate(text, { from: baseLang, to: lang }, (_err, res) => {
                    if (res.text == undefined) {
                        msg.channel.send(errors.WrongLang);
                        return;
                    }
                    msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`O to twój przetłumaczony text, ${memberN}`)
                        .addField('Język bazowy :', `\`${baseLang}\``, true).addField('Tekst bazowy :', `\`${text}\``, true).addBlankField()
                        .addField('Język docelowy :', `\`${lang}\``, true).addField('Tekst przetłumaczony', `\`${res.text[0]}\``, true).setColor('RANDOM'));
                });
            });
        }
    }
}