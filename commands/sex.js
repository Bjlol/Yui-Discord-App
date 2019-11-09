const utils = require('./../utils.js'), mentions = require('./../mention.js'),
    commands = require('./../commands.js'), StringReader = require('./../stringReader.js'),
    errors = require('./../errors.js');

module.exports = {
    name: "sex",
    execute: (Yui, msg) => {
        let KeikoGuildMember = msg.guild.members.find(member => member.id === '622783718783844356');
        console.log(KeikoGuildMember)
        if(!KeikoGuildMember) {
            msg.channel.send('No sorka ale to nie zadziała... Bez Keiko to nie zadziała!')
            return;
        }
        msg.channel.send(new Yui.Discord.RichEmbed().setTitle('No hej!').addField('Tu masz krótki filmik',
         `[kliknij tutaj](https://www.youtube.com/watch?v=LC1vhpW15xg)`))
    }
}