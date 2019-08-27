const utils = require('./../utils.js'), mentions = require('./../mention.js'),
    commands = require('./../commands.js'), StringReader = require('./../stringReader.js'),
    errors = require('./../errors.js');

module.exports = {
    name: "hero",
    execute: (msg, memberN, Discord, GuildsData, Heroes, help) => {
        if (help) {
            let embed = new Discord.RichEmbed().setTitle(`Witaj ${memberN}`).addField('Użycie komendy:', '`yui!hero <gałąź> <argumenty / help>`')
                .addField('Opis', 'W zależności od gałęzi pomagam zarządzać twoim bohaterem')
                .addField('Gałęzie:', `\`create\` - Tworzy nowego bohatera
                                       \`list\` - Pokazuję listę bohaterów i ich id (potrzebne do innych komend)
                                       \`info\` - Pokazuję info o bohaterze
                                       \`field\` - Zarządza polami informacji bohatera
                                       \`delete\` - Usuń postać
                                       \`status\` - Pokazuje status postaci (Zaakctepowana, Odrzucona, Do sprawdzenia)
                                       \`check\` - Przekazuje postać do sprawdzenia dla administracji
                                       \`pass\` - Oddaje komuś twoją postać`)
            if (msg.member.hasPermission('MANAGE_ROLES') || utils.isOwner(msg.author.id)) {
                embed.addField('Gałęzie admina:',
                    `|➜ \`approve\` - Akctepuj bohatera
                |➜ \`decline\` - Odrzuć bohatera`)
            }
            msg.channel.send(embed)
        } else {
            let interpenter = new StringReader(msg.content.substring('yui!hero'.length))
            let sub = [];
            sub[0] = interpenter.readWord();
            if (interpenter.getText().length == 0 || !interpenter.canRead()) {
                msg.channel.send('Przepraszam bardzo, czemu to jest puste... >.< \nWpisz `yui!hero help` Po więcej informacji!')
                return;
            }
            switch (sub[0]) {
                case 'create':
                    sub[1] = interpenter.readQuotedString();
                    if(sub[1].length < 1) {
                        msg.channel.send()
                    }
                    let newHero = {
                        equipment: JSON.stringify([]),
                        xp: 0,
                        lvl: 1,
                        money: 0,
                        userId: msg.author.id,
                        guildId: msg.guild.id,
                        name: sub[1],
                        fields: JSON.stringify([]),
                        status: 0
                    }
                    return {action: 'create', data: newHero}
            }
        }
    }
}