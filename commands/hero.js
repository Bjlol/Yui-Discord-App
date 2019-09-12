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
                                       \`remove\` - Usuwam bohatera o określonym id
                                       \`info\` - Pokazuję info o bohaterze (lub innym członku serwera jak i jego postaciach)
                                       \`field\` - Zarządza polami informacji bohatera
                                       \`delete\` - Usuń postać
                                       \`status\` - Pokazuje status postaci (Zaakctepowana, Odrzucona, Do sprawdzenia)
                                       \`check\` - Przekazuje postać do sprawdzenia dla administracji
                                       \`list\` - Pokazuj liste bohaterów na serwerze
                                       \`pass\` - Oddaje komuś twoją postać (W kolejnej wersji)
                                       \`image\` - Ustawia zdjęcie postaci
                                       \`update\` - Aktualizuje kp postaci o określonym ID
                                       Help po gałęzi po więcej informacji! Wyjątkiem jest create gdzie 'help' musi być w \`"\``)
            if (msg.member.hasPermission('MANAGE_ROLES') || utils.isOwner(msg.author.id)) {
                embed.addField('Gałęzie admina:', '|➜ \`approve\` - Akctepuj bohatera\n|➜ \`decline\` - Odrzuć bohatera')
            }
            msg.channel.send(embed)
        } else {
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
            let contains;
            let hero;
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
                        equipment: JSON.stringify([]),
                        xp: 0,
                        lvl: 1,
                        money: 0,
                        userId: msg.author.id,
                        guildId: msg.guild.id,
                        name: sub[1],
                        fields: JSON.stringify([]),
                        status: 0,
                        channelid: null,
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
                case 'field':
                    sub[1] = interpenter.readWord();
                    if (sub[1] == 'help') {
                        msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                            .addField('Użycie komendy', 'yui!hero field <id postaci> "<id / nazwa pola>" <wartość>')
                            .addField('Dodatkowa pomoc:',
                                `Zmieniam parametry postaci! Dla listy pól wpisz \`yui!hero field list\`\nPro tip: Jeśli pole jest typu **string** ujmij wartość pomiędzy \`"\``))
                        return;
                    }
                    if (sub[1] == 'list') {
                        let gdFields = JSON.parse(GuildsData.fields)
                        let mess = gdFields.reduce((sum, acc) => {
                            return sum += `- '**${acc.name}**', **${acc.optional == 'yes' ? 'jest' : 'nie jest'}** opcjonalne a typ to **${acc.type}**, id: **${acc.id}**\n`
                        }, '')
                        if (mess == '') msg.channel.send('Na tym serwerze nie ma żadnych pól!')
                        else msg.channel.send(new Discord.RichEmbed().setTitle('Witaj!').addField('O to pola dostępne na serwerze:', mess))
                        return;
                    }
                    hero = Heroes.find(elt => elt.dataValues.id == sub[1])
                    if (!hero) {
                        msg.channel.send(errors.CantFind)
                        return;
                    }
                    sub[2] = interpenter.readQuotedString();
                    let field = JSON.parse(GuildsData.fields).find(elt => elt.name == sub[2] || elt.id == sub[2])
                    if (!field) {
                        msg.channel.send(errors.WrongField)
                    }
                    switch (field.type) {
                        case 'point':
                            sub[3] = interpenter.readPoint();
                            break;
                        case 'string':
                            sub[3] = interpenter.readQuotedString();
                            break;
                        case 'int':
                            sub[3] = interpenter.readInt();
                            break;
                    }
                    contains = Heroes.reduce((sum, acc) => {
                        if (!sum) return acc.id == sub[1] ? true : false
                        else return true;
                    }, false)
                    if (contains) {
                        let fields = JSON.parse(hero.fields)
                        let target = fields.find(elt => elt.id == field.id)
                        if (target) {
                            target.data = sub[3];
                            fields[fields.findIndex(elt => elt.id == target.id)] = target;
                            msg.channel.send(`Zaktualizowano pole '**${target.name}**' na wartość '${sub[3]}'`)
                            return { action: 'update', data: { what: 'fields', data: JSON.stringify(fields), id: sub[1] } }
                        } else {
                            let target = {
                                name: field.name,
                                data: sub[3],
                                id: field.id
                            }
                            fields.push(target)
                            msg.channel.send(`Zaktualizowano pole '**${target.name}**' na wartość '${sub[3]}'`)
                            return { action: 'update', data: { what: 'fields', data: JSON.stringify(fields), id: sub[1] } }
                        }
                    } else {
                        msg.channel.send(`No sorka! Ale nie mogę znaleźć twojej postaci o id **${sub[1]}** \nMoże pomyliłeś serwery albo nie jest to twoja postać ¯\\_(ツ)_/¯`)
                        return;
                    }
                case 'status':
                    sub[1] = interpenter.readWord();
                    if (sub[1] == 'help') {
                        msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                            .addField('Użycie komendy', 'yui!hero status <id>')
                            .addField('Dodatkowa pomoc:',
                                `Pokazuje status postaci o określonym id`))
                        return;
                    }
                    return { action: 'status', data: sub[1] }
                case 'check':
                    sub[1] = interpenter.readWord();
                    if (sub[1] == 'help') {
                        msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                            .addField('Użycie komendy', 'yui!hero check <id>')
                            .addField('Dodatkowa pomoc:',
                                `Wysyłam postać o określonym id do sprawdzenia dla administracji`))
                        return;
                    }
                    hero = Heroes.find(elt => elt.dataValues.id == sub[1])
                    if (!hero) {
                        msg.channel.send(errors.CantFind)
                        return;
                    }
                    if (hero.status == 0 || hero.status == 2) return { action: 'update', data: { what: 'status', id: sub[1], data: 1 } }
                    else msg.channel.send(`Twoja postać już została zgłoszona do sprawdzenia lub została zaakceptowana\nStatus tej postaci sprawdzisz komendą \`yui!hero status ${sub[1]}\``)
                case 'show':
                    sub[1] = interpenter.readWord();
                    if (sub[1] == 'help') {
                        msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                            .addField('Użycie komendy', 'yui!hero list <typ> <numer strony>')
                            .addField('Dodatkowa pomoc:',
                                `Pokazuję listę postaci na serwerze!\nTypy: \n-\`all\` - wszystkie (do sprawdzenia itd) Domyślna wartość\n-\`accepted\` - Zaakceptowane\n-\`declined\` - Odrzucone\n\`writing\` - W trakcie pisania\n\`check\` - Do sprawdzenia\n\`declined\` - Odrzucone`))
                        return;
                    }
                    sub[2] = sub[1] != undefined ? interpenter.readInt() : 1;
                    return { action: 'show', data: sub[1] == undefined ? 'all' : sub[1], id: sub[2] }
                case 'accept':
                    if (msg.member.hasPermission('MANAGE_ROLES') || utils.isOwner(msg.author.id)) {
                        sub[1] = interpenter.readWord();
                        if (sub[1] == 'help') {
                            msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                                .addField('Użycie komendy', 'yui!hero accept <id>')
                                .addField('Dodatkowa pomoc:',
                                    `Akceptuje postać o określonym id`))
                            return;
                        }
                        msg.channel.send(`Zaakceptowano postać o id ${sub[1]}`)
                        return { action: 'update', data: { what: 'status', id: sub[1], data: 3 } }
                    } else {
                        msg.channel.send(errors.NoPerms)
                        return
                    }
                case 'decline':
                    if (msg.member.hasPermission('MANAGE_ROLES') || utils.isOwner(msg.author.id)) {
                        sub[1] = interpenter.readWord();
                        if (sub[1] == 'help') {
                            msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                                .addField('Użycie komendy', 'yui!hero status <id>')
                                .addField('Dodatkowa pomoc:',
                                    `Odrzuca postać o określonym id`))
                            return;
                        }
                        msg.channel.send(`Odrzucono postać o id ${sub[1]}`)
                        return { action: 'update', data: { what: 'status', id: sub[1], data: 2 } }
                    } else {
                        msg.channel.send(errors.NoPerms)
                        return
                    }
                    /*
                case 'export':
                    sub[1] = interpenter.readWord();
                    if (sub[1] == 'help') {
                        msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                            .addField('Użycie komendy', 'yui!hero export <id>')
                            .addField('Dodatkowa pomoc:',
                                `Exportuje postać o określonym id do tekstu w formacie JSON`))
                        return;
                    }
                    hero = Heroes.find(elt => elt.dataValues.id == sub[1])
                    if (!hero) {
                        msg.channel.send(errors.CantFind)
                        return;
                    }
                    let exportText = hero.dataValues;
                    exportText.fields = JSON.parse(exportText.fields)
                    exportText.equipment = JSON.parse(exportText.equipment)
                    msg.channel.send('Zbieram dane o twojej postaci! Daj mi chwilkę (￣▽￣)ノ')
                    msg.channel.send(`\`\`\`${JSON.stringify(exportText)}\`\`\``, {split: true});
                    break;
                case 'import':
                    sub[1] = interpenter.readWord();
                    if (sub[1] == 'help') {
                        msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                            .addField('Użycie komendy', 'yui!hero import <id> "<data>"')
                            .addField('Dodatkowa pomoc:',
                                `Importuje z postać z dostarczonych danych.\nUważaj! Możesz zniszczyć sobie postać! **Korzystasz na własną odpowiedzialność**`))
                        return;
                    }
                    hero = Heroes.find(elt => elt.dataValues.id == sub[1])
                    if (!hero) {
                        msg.channel.send(errors.CantFind)
                        return;
                    }
                    interpenter.skipSpaces();
                    sub[2] = interpenter.getText().substring(interpenter.getCursor())

                    msg.channel.send('Importuje! Daj mi chwilkę (￣▽￣)ノ').then(msge => {
                        msge.channel.send(`Zrobione zobacz info o swojej postaci używając komendy \`yui!hero info ${sub[1]}\``)
                    })
                    return { action: 'update', data: { what: 'whole', id: sub[1], data: sub[2] } }
                    */
                case 'image':
                    sub[1] = interpenter.readWord()
                    sub[2] = interpenter.readQuotedString();
                    if (sub[1] == 'help') {
                        msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                            .addField('Użycie komendy', 'yui!hero image <id> "<link do zdjęcia>"')
                            .addField('Dodatkowa pomoc:',
                                `Dodaje zdjęcie postaci do kp. Zobacz \`yui!hero info ${sub[1]}\`, Po podgląd`))
                        return;
                    }
                    msg.channel.send('Zaktualizowano twoje zdjęcie na: ', new Discord.Attachment(sub[2]))
                    return { action: 'update', data: { what: 'image', id: sub[1], data: sub[2] } };
                case 'channel':
                    if (!(msg.member.hasPermission('MANAGE_ROLES') || utils.isOwner(msg.author.id))) {
                        msg.channel.send(errors.NoPerms)
                        return;
                    }
                    sub[1] = interpenter.readWord()
                    if (sub[1] == 'help') {
                        msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${memberN}`)
                            .addField('Użycie komendy', 'yui!hero channel <id> <oznacz kanal>')
                            .addField('Dodatkowa pomoc:',
                                `Przypisuje kanał do postaci! Po komendzie \`yui!hero update\`, wyczyszcze, kanał i wyslę wiadomość z aktualnymi danymi postaci\nUżyj \`yui!hero channel clear\`, aby odpisać kanał od postaci.`))
                        return;
                    }
                    sub[2] = msg.mentions.channels.first() ? msg.mentions.channels.first().id : null;
                    if (sub[2] == 'clear') {
                        return { action: 'update', data: { what: 'channel', id: sub[1], data: sub[2] } };
                    }
                    if (sub[2] == null) {
                        msg.channel.send(errors.KillMe);
                        return;
                    }
                    msg.channel.send(`Przypisano kanał: <#${sub[2]}>\nUżyj \`yui!hero update ${sub[1]}\` żeby zaktualizwać informacje o postaci!`)
                    return { action: 'update', data: { what: 'channel', id: sub[1], data: sub[2] } };
                case 'update':
                    sub[1] = interpenter.readWord();
                    hero = Heroes.find(elt => elt.dataValues.id == sub[1])
                    if (!hero) {
                        msg.channel.send(errors.CantFind)
                        return;
                    }
                    if (!hero.channelid) {
                        msg.channel.send('Z aktualizacji nici... Poproś administratora o przypisanie kanału do postaci!')
                        return;
                    }
                    msg.channel.send('Pomyślnie zaktualizowano informacje')
                    return { action: 'channelUpdate', data: { id: sub[1], channel: hero.channelid } }
            }
        }
    }
}

function encrypt(guildId, userId, id) {
    let enc = guildId + userId;
    enc = enc.split('').reduce((sum, acc) => {
        let sums = sum;
        if (~~acc % 2 == 1) return sums
        if (sums.last == acc) return sums
        else {
            sums.last = acc;
            sums.sum += acc;
            return sums;
        }
    }, { last: '', sum: '' })
    return `${enc.sum}${id}`;
}