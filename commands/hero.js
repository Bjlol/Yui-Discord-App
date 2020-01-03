const utils = require('./../utils.js'), commands = require('./../commands.js'), StringReader = require('./../stringReader.js'),
    errors = require('./../errors.js');

module.exports = {
    name: "hero",
    execute: (Yui, msg, memberN, GuildsData, Heroes) => {

        if (!GuildsData.rpEnabled) {
            msg.channel.send('Ta komenda jest zablokowana! Odblokuj paczkę RP, korzystając z komendy `yui!settings enable rp`')
            return;
        }
        let interpenter = new StringReader(msg.content.substring('yui!hero'.length))
        let sub = [];
        if (interpenter.getText().length == 0 || !interpenter.canRead()) {
            msg.channel.send('Przepraszam bardzo, czemu to jest puste... >.< \nWpisz `yui!hero help` Po więcej informacji!')
            return;
        }
        sub[0] = interpenter.readWord();
        if (sub[0] == 'help') {
            let embed = new Yui.Discord.RichEmbed().setTitle(`Witaj ${memberN}`).addField('Użycie komendy:', '`yui!hero <gałąź> <argumenty / help>`')
                .addField('Opis', 'W zależności od gałęzi pomagam zarządzać twoim bohaterem')
                .addField('Gałęzie:', `\`create\` - Tworzy nowego bohatera
                                       \`list\` - Pokazuję listę bohaterów i ich id (potrzebne do innych komend)
                                       \`remove\` - Usuwam bohatera o określonym id
                                       \`info\` - Pokazuję info o bohaterze (lub innym członku serwera jak i jego postaciach)
                                       \`edit\` - Wysyła link do edycji postaci (Nie pokazuj go nikomu!)`)
            msg.channel.send(embed)
            return;
        }
        let contains, hero;
        switch (sub[0]) {
            case 'create':
                sub[1] = interpenter.readQuotedString();
                if (sub[1].length < 1) {
                    msg.channel.send('Przepraszam bardzo, czemu to jest puste... >.< \nWpisz `yui!hero create "help"` Po więcej informacji!')
                    return;
                }
                if (JSON.parse(GuildsData.config).max < Heroes.length + 1) {
                    msg.channel.send('Sorka! Osiągnąłeś limit postaci na tym serwerze!')
                    return;
                }
                if (sub[1] == 'help') {
                    msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                        .addField('Użycie komendy', 'yui!hero create "<nazwa>"')
                        .addField('Dodatkowa pomoc:',
                            `Tworzę nowego bohatera o podanej nazwie! Nie używaj proszę \`"\` w nazwie bo nie zadziała!`))
                    return;
                }
                let newHero = {
                    equipment: JSON.stringify([]), xp: 0, lvl: 1,
                    money: 0, userId: msg.author.id, guildId: msg.guild.id, name: sub[1],
                    fields: JSON.stringify([]), status: 0, channelid: null,
                    id: encrypt(msg.guild.id, msg.author.id, Heroes.length + 1)
                }
                msg.channel.send(`Stworzono nowego bohatera o nazwie **${newHero.name}**, wypełnij wymagane pola i ciesz się zabawą! Id postaci: ${newHero.id}`)
                return { action: 'create', data: newHero }
            case 'list':
                if (sub[1] == 'help') {
                    msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                        .addField('Użycie komendy', 'yui!hero list')
                        .addField('Dodatkowa pomoc:',
                            `Pokazuje listę twoich bohaterów!`))
                    return;
                }
                let mentionedMember = msg.mentions.members.first();
                if (!mentionedMember) {
                    let mess = Heroes.reduce((sum, acc) => {
                        return sum + `**${acc.name}**, id: ${acc.id}\n`
                    }, '');
                    if (mess == '') msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`).addField('Sorka! Ale nie masz żadnych postaci', 'Stwórz sobie jedną komendą `yui!hero create`'))
                    else msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`).addField('Lista twoich postaci:', mess))
                } else {
                    return { action: 'list', data: { uid: mentionedMember.id, gid: msg.guild.id } };
                }
                break;
            case 'remove':
                sub[1] = interpenter.readWord();
                if (sub[1] == 'help') {
                    msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                        .addField('Użycie komendy', 'yui!hero remove <id>')
                        .addField('Dodatkowa pomoc:',
                            `Usuwam bohatera o określonym id`))
                    return;
                }
                let pass = Heroes.reduce((sum, acc) => {
                    if (!sum) return acc.userId == msg.author.id ? true : false
                    else return true;
                }, false)
                contains = Heroes.reduce((sum, acc) => {
                    if (!sum) return acc.id == sub[1] ? true : false
                    else return true;
                }, false)
                if (contains) {
                    if (pass) msg.channel.send(`Usunięto postać o id **${sub[1]}**`)
                    else msg.channel.send(errors.NoPerms)
                    return { action: 'remove', data: sub[1] }
                } else {
                    msg.channel.send(`No sorka! Ale nie mogę znaleźć twojej postaci o id **${sub[1]}** \nMoże pomyliłeś serwery albo nie jest to twoja postać ¯\\_(ツ)_/¯`)
                    return;
                }
            case 'info':
                if (sub[1] == 'help') {
                    msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                        .addField('Użycie komendy', 'yui!hero info <id>')
                        .addField('Dodatkowa pomoc:',
                            `Pokazuje informacje o określonym bohaterze`))
                    return;
                }
                sub[1] = interpenter.readWord();
                return { action: 'info', data: sub[1] }
            case 'edit':
                if (sub[1] == 'help') {
                    msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                        .addField('Użycie komendy', 'yui!hero edit <id>')
                        .addField('Dodatkowa pomoc:',
                            `Wysyłam link do edycji postaci!`))
                    return;
                }
                sub[1] = interpenter.readWord();
                return { action: 'edit', data: sub[1] }
        }
    }
}

function encrypt(guildId, userId, id) { return `${guildId}${userId}${id}`; }