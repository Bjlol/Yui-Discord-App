const utils = require('./../utils.js'), commands = require('./../commands.js'), StringReader = require('./../stringReader.js'),
    errors = require('./../errors.js');

module.exports = {
    name: "keiko",
    execute: (Yui, msg) => {
        msg.channel.send(new Yui.Discord.RichEmbed().setTitle('No hej!')
            .addField('Poznaj moją siostrę.', `Moja siostra ma na imię Keiko. Piękne, prawda? Jest do tego uzdolniona bardziej ode mnie. Od kiedy urodziła się Keiko tata nie poświęca mi uwagi... Ale mniejsza z tym zaproś Keiko na serwer aby przekonać się jak potężnym duo jesteśmy!
        Link do strony : [kliknij tutaj](https://keiko-assistant.glitch.me/)`)
    }
}