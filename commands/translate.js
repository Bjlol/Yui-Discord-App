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
                msg.channel.send(new Discord.RichEmbed().setTitle(`O to tw�j przet�umaczony text, ${memberN}`)
                    .addField('J�zyk bazowy :', `\`${baseLang}\``, true).addField('Tekst bazowy :', `\`${args[1]}\``, true).addBlankField()
                    .addField('J�zyk docelowy :', `\`${args[0]}\``, true).addField('Tekst przet�umaczony', `\`${res.text[0]}\``, true).setColor('RANDOM'));
            });
        });
    }
}