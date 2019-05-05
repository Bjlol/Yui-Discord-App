let errors = require('./../errors.js')

module.exports = {
    name: "translate",
    execute: (msg, args, yandex) => {
        yandex.detect(text, (_err, res) => {
            var baseLang = res.lang;
            yandex.translate(text, { from: baseLang, to: args[0] }, (_err, res) => {
                if (res.text == undefined) {
                    msg.channel.send(errors.WrongLang);
                    return;
                }
                msg.channel.send(new Discord.RichEmbed().setTitle(`O to twój przet³umaczony text, ${memberN}`)
                    .addField('Jêzyk bazowy :', `\`${baseLang}\``, true).addField('Tekst bazowy :', `\`${args[1]}\``, true).addBlankField()
                    .addField('Jêzyk docelowy :', `\`${args[0]}\``, true).addField('Tekst przet³umaczony', `\`${res.text[0]}\``, true).setColor('RANDOM'));
            });
        });
    }
}