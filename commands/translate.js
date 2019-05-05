let errors = require('./../errors.js')

module.exports = {
    name: "translate",
    execute: (msg, args, yandex, Discord) => {
        var memberN = msg.member.nickname;
        if (memberN === null) memberN = msg.author.username;
        yandex.detect(args[1], (_err, res) => {
            var baseLang = res.lang;
            yandex.translate(args[1], { from: baseLang, to: args[0] }, (_err, res) => {
                if (res.text == undefined) {
                    msg.channel.send(errors.WrongLang);
                    return;
                }
                msg.channel.send(new Discord.RichEmbed().setTitle(`O to twój przetłumaczony text, ${memberN}`)
                    .addField('Język bazowy :', `\`${baseLang}\``, true).addField('Tekst bazowy :', `\`${args[1]}\``, true).addBlankField()
                    .addField('Język docelowy :', `\`${args[0]}\``, true).addField('Tekst przetłumaczony', `\`${res.text[0]}\``, true).setColor('RANDOM'));
            });
        });
    }
}