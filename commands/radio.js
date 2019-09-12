const StringReader = require('./../stringReader.js'), errors = require('./../errors.js'), utils = require('./../utils.js'), Discord = require('discord.js')

module.exports = {
    name: "radio",
    execute: (Yui, msg) => {
        let interpenter = new StringReader(msg.content.substring('yui!radio'.length)), sub = [];
        sub[0] = interpenter.readWord();
        switch (sub[0]) {
            case 'join':
                sub[1] = interpenter.readWord();
                msg.guild.channels.get(sub[1]).join().then(msg.channel.send('Dołączyłam do kanału!'));
                break;
            case 'list':
                msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj ${utils.getAuthorName(msg)}`)
                .addField('Lista dostępnych stacji', '- radio wrocław\n- rmf fm'))
                break;
            case 'play':
                let connection = Yui.voiceConnections.get(msg.guild.id)
                if (connection == undefined) {
                    msg.channel.send('Najpierw muszę być w kanale żeby puścić radio / piosenkę...')
                    return;
                }
                sub[1] = interpenter.readQuotedString();
                if (sub[1] != undefined) {
                    sub[1] = sub[1].toLowerCase();
                } else {
                    msg.channel.send(errors.KillMe);
                    return;
                }
                switch (sub[1]) {
                    case 'radio wrocław':
                        connection.playStream('http://stream4.nadaje.com:9240/prw')
                        msg.channel.send('Puszczam Radio Wrocław')
                        break;
                    case 'rmf fm':
                        connection.playStream('http://80.48.65.99/RMFFM48')
                        msg.channel.send('Odtwarzam radio RMF FM');
                        break;
                    default:
                        break;
                }
                break;
            case 'leave':
                if (Yui.voiceConnections.get(msg.guild.id) == undefined) {
                    msg.channel.send('Najpierw muszę być w kanale żeby wyjść...')
                    return;
                }
                Yui.voiceConnections.get(msg.guild.id).disconnect()
                msg.channel.send('Już uciekam z czatu głosowego!')
                break;
            case 'help':
                msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`)
                    .addField('Użycie komendy', 'yui!radio <podkomenda>')
                    .addField('Szczegółowe informacje',
                        `Podkomendy
                    - join <id kanału> - Dołączam do kanału głosowego
                    - play "<nazwa stacji / link do piosenki>" - Odtwarzam wybraną stacje / piosenkę
                    - list - Lista dostępych stacji
                    - leave - Opuszczam kanał`))
        }
    }
}