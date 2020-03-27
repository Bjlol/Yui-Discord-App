const StringReader = require('./../stringReader.js'), errors = require('./../errors.js'), utils = require('./../utils.js');

module.exports = {
    name: "settings",
    execute: (Yui, msg) => {
        Yui.GuildData.findOrCreate({ where: { guildId: msg.guild.id }, defaults: utils.getGDT(msg.guild.id) }).then(gdata => {
            let GuildData = gdata[0].dataValues;
            let GuildDataTemplate = utils.getGDT(msg.guild.id);
            if (!(msg.member.hasPermission('MANAGE_ROLES') || utils.isOwner(msg.author.id))) {
                msg.channel.send(errors.NoPerms);
                return;
            }
            let interpenter = new StringReader(msg.content.substring('yui!settings'.length));
            let help = interpenter.readWord() == 'help' ? true : false;
            let mess = JSON.parse(GuildData.Messages)
            if (mess.ApproveMess === null) mess.ApproveMess = { 'message': null, role: { add: null, remove: null } }
            if (mess.DeclineMess === null) mess.DeclineMess = { 'message': null, role: { add: null, remove: null } }
            GuildData.Messages = JSON.stringify(mess);
            if (!Array.isArray(JSON.parse(GuildData.fields))) GuildData.fields = JSON.stringify([]);
            if (!Array.isArray(JSON.parse(GuildData.Shop))) GuildData.Shop = JSON.stringify([]);
            if (help) {
                msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`).addField('Użycie komendy', 'yui!settings <gałązki itd>').addField('Gałązki',
                    `> **max** - Ustawia maksymalną liczbę postaci (Wymaga paczki RP)
            > **channel** - Ustawia kanał dla komendy 'chat'
            > **enable** / **disable** - Wyłącza / włącza funkcjonalność nie których komend (paczek).
            > **messages** - Jaką wiadomość wysłać po zakceptowaniu / odrzuceniu postaci?
            > **roles** - Jaką rolę dać po zakceptowaniu / odrzuceniu postaci?
            > **fields** - Pola postaci do rp (Wymaga paczki RP)
            > **reset** - Przywraca wartości domyślne serwera
            Gdy nic nie wpiszesz pokażą się aktualne ustawienia
            Status 'paczek' sprawdzisz \`yui!settings enable\` lub \`yui!settings disable\`
            Help po gałązce żeby dowiedzieć się więcej`));
            } else {
                let interpenter = new StringReader(msg.content.substring('yui!settings'.length));
                var sub = [];
                sub[0] = interpenter.readWord();
                switch (sub[0]) {
                    case 'max':
                        if (GuildData.rpEnabled) {
                            sub[1] = interpenter.readWord();
                            switch (sub[1]) {
                                case 'set':
                                    sub[2] = interpenter.readInt();
                                    if (Math.sign(sub[2]) === 1) {
                                        let data = JSON.parse(GuildData.config);
                                        data.max = sub[2];
                                        GuildData.config = JSON.stringify(data);
                                        msg.channel.send('Ustawiono na ' + sub[2])
                                    } else {
                                        msg.channel.send(errors.NumberBelowZero);
                                    }
                                    break;
                                case 'clear':
                                    let data = JSON.parse(GuildData.config);
                                    data.max = 3;
                                    GuildData.config = JSON.stringify(data);
                                    msg.channel.send('Ustawiono na wartość domyślną, `3`');
                                    break;
                                case 'help':
                                    msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`)
                                        .addField('Użycie komendy', 'yui!settings max <ciąg dalszy>')
                                        .addField('Dodatkowa pomoc:',
                                            `> \`set\` <cyfra> - Ustawia maksymalną liczbe postaci na serwerze
                                        > \`clear\` - Przywraca wartość domyślną (3)
                                        > \`help\` - Pokazuje tą wiadomość
                                        Bez argumentów pokazuje aktualną maksymalną liczbe postaci na serwerze!`));
                                    return;
                                default:
                                    msg.channel.send('Możesz mieć maksymalnie ' + JSON.parse(GuildData.config).max + ' postaci');
                                    break;
                            }
                        } else {
                            msg.channel.send('Ta komenda jest zablokowana! Odblokuj paczkę RP, korzystając z komendy `yui!settings enable rp`');
                        }
                        break;
                    case 'enable':
                        sub[1] = interpenter.readWord()
                        switch (sub[1]) {
                            case 'rp':
                                GuildData.rpEnabled = true;
                                msg.channel.send('Zmieniono status `rp` na włączone, od teraz komenda `hero` jest dostępna!')
                                break;
                            case 'money':
                                GuildData.MoneySystem = true;
                                msg.channel.send('Zmieniono status `money` na włączone, od teraz komendy związane z zarządzaniem pieniądzami postaci są dostępne')
                                break;
                            case 'xp':
                                GuildData.XPSystem = true;
                                msg.channel.send('Zmieniono status `xp` na włączone, od teraz zdobywanie związane z zarządzaniem exp postaci są dostępne')
                                break;
                            case 'help':
                                msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`)
                                    .addField('Użycie komendy', 'yui!settings enable <paczka>')
                                    .addField('Dodatkowa pomoc:',
                                        `> \`rp\` - Odblokowuje paczkę \`RP\`
                                    > \`money\` - Odblokowuje paczkę \`Money\`
                                    > \`Xp\` - Odblokowuje paczkę \`Xp\`
                                    > \`help\` - Pokazuje tą wiadomość
                                    Bez argumentów pokazuje aktualny status paczek!`))
                                return;
                            default:
                                msg.channel.send('Status:'
                                    + `\n\`Rp\` - ${GuildData.rpEnabled ? 'włączone' : 'wyłączone'}`
                                    + `\n\`Money\` - ${GuildData.MoneySystem ? 'włączone' : 'wyłączone'}`
                                    + `\n\`Xp\` - ${GuildData.XPSystem ? 'włączone' : 'wyłączone'}`)
                                break;
                        }
                        break;
                    case 'disable':
                        sub[1] = interpenter.readWord()
                        switch (sub[1]) {
                            case 'rp':
                                GuildData.rpEnabled = false;
                                msg.channel.send('Zmieniono status `rp` na wyłączone!')
                                break;
                            case 'money':
                                GuildData.MoneySystem = false;
                                msg.channel.send('Zmieniono status `money` na wyłączone!')
                                break;
                            case 'xp':
                                GuildData.XPSystem = false;
                                msg.channel.send('Zmieniono status `xp` na wyłączone!')
                                break;
                            case 'help':
                                msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`)
                                    .addField('Użycie komendy', 'yui!settings disable <paczka>')
                                    .addField('Dodatkowa pomoc:',
                                        `> \`rp\` - Wyłącza paczkę \`RP\`
                                    > \`money\` - Wyłącza paczkę \`Money\`
                                    > \`Xp\` - Wyłącza paczkę \`Xp\`
                                    > \`help\` - Pokazuje tą wiadomość
                                    Bez argumentów pokazuje aktualny status paczek!`))
                                return;
                            default:
                                msg.channel.send('Status:'
                                    + `\n\`Rp\` - ${GuildData.rpEnabled ? 'włączone' : 'wyłączone'}`
                                    + `\n\`Money\` - ${GuildData.MoneySystem ? 'włączone' : 'wyłączone'}`
                                    + `\n\`Xp\` - ${GuildData.XPSystem ? 'włączone' : 'wyłączone'}`)
                                break;
                        }
                        break;
                    case 'fields':
                        sub[1] = interpenter.readWord();
                        let gdFields = JSON.parse(GuildData.fields)
                        switch (sub[1]) {
                            case 'add':
                                sub[2] = interpenter.readQuotedString();
                                sub[3] = interpenter.readWord();
                                sub[4] = interpenter.readWord();
                                if (sub[3] !== 'yes' && sub[3] !== 'no') {
                                    msg.channel.send(errors.KillMe);
                                    return;
                                }
                                if (sub[4] !== 'int' && sub[4] !== 'point' && sub[4] !== 'string') {
                                    msg.channel.send(errors.KillMe);
                                    return;
                                }
                                let field = {
                                    name: sub[2], optional: sub[3],
                                    type: sub[4], id: gdFields.length + 1
                                }
                                gdFields.push(field);
                                GuildData.fields = JSON.stringify(gdFields);
                                msg.channel.send(`Dodano pole o nazwie **${'"' + sub[2] + '"'}**, które **${sub[3] == 'yes' ? 'jest' : 'nie jest'}** opcjonalne a jego typ to **${sub[4]}**`);
                                break;
                            case 'remove':
                                sub[2] = interpenter.readInt();
                                let fieldTD = gdFields.findIndex(elt => elt.id === sub[2]);
                                if (fieldTD === -1) {
                                    msg.channel.send(errors.CantFind);
                                    return;
                                } else {
                                    let deletedField = gdFields.splice(fieldTD, 1)[0];
                                    msg.channel.send(`Usunięto pole o nazwie **${'"' + deletedField.name + '"'}**, które **${deletedField.optional == 'yes' ? 'jest' : 'nie jest'}** opcjonalne a jego typ to **${deletedField.type}**`);
                                }
                                break;
                            case 'help':
                                msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`)
                                    .addField('Użycie komendy', 'yui!settings fields <dalszy ciąg>')
                                    .addField('Dodatkowa pomoc:',

                                        `Komenda służy do zarządzania wzorem KP!! Jeśli chcesz dodać pole do postaci zobacz \`yui!hero field help\`
                                    > \`add\` "<nazwa>" <opcjonalne> <typ> - Dodaje pole do karty postaci
                                    > \`remove\` <id> - Usuwa pole o określonym id (zobacz \`list\` po id)
                                    > \`list\` - Pokazuje listę dostępnych pól
                                    > \`help\` - Pokazuje tą wiadomość
                                    Nazwa musi być w pomiędzy \`"\`, opcjonalne - Przyjmuje tylko wartości \`yes\` i \`no\`
                                    Typy pól: \n\`int\` - Liczba\n\`point\` - Liczba zmiennoprzecinkowa np. \`1.2\`\n\`string\` - Dowolny ciąg znaków, przy wypełnianiu \`\\n\` to nowa lina!`));
                                return;
                            case 'list':
                                let mess = gdFields.reduce((sum, acc) => {
                                    return sum += `- '**${acc.name}**', **${acc.optional == 'yes' ? 'jest' : 'nie jest'}** opcjonalne a typ to **${acc.type}**, id: **${acc.id}**\n`
                                }, '')
                                if (mess == '') msg.channel.send('Nie masz żadnych pól >.<\nPo pomoc \`yui!settings fields help\`')
                                else msg.channel.send(new Yui.Discord.RichEmbed().setTitle('Witaj!').addField('O to pola dostępne na serwerze:', mess));
                        }
                        break;
                    case 'reset':
                        GuildData = GuildDataTemplate;
                        msg.channel.send('Pomyślnie przywrócono wartości domyślne w ustawieniach!');
                        break;
                    default:
                        let config = JSON.parse(GuildData.config)
                        msg.channel.send(new Yui.Discord.RichEmbed().setTitle('Witaj').addField('Id serwera:', GuildData.guildId)
                            .addField('Maksymalna liczba postaci:', config.max)
                            .addField('Kanał do komendy `chat` (Wkrócte):', config.chatChannel === null ? 'Domyślne' : config.chatChannel)
                            .addField('Skalowanie z lvl komendy atak (wkrótce)', config.atackScalling)
                            .addField('Bazowy dmg komendy atak (wkrótce)', config.atackBase)
                            .addField('Startowy stan konta postaci (wkrótce)', config.startingBalance)
                            .addField('Paczki', `\n\`Rp\` - ${GuildData.rpEnabled ? 'włączone' : 'wyłączone'}`
                                + `\n\`Money\` - ${GuildData.MoneySystem ? 'włączone' : 'wyłączone'}`
                                + `\n\`Xp\` - ${GuildData.XPSystem ? 'włączone' : 'wyłączone'}`)
                            .setColor('RANDOM'));
                }
                Yui.GuildData.update(GuildData, { where: { guildId: msg.guild.id } });
            }
        });
    }
}
