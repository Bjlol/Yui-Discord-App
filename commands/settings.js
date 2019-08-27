const StringReader = require('./../stringReader.js'), errors = require('./../errors.js'), utils = require('./../utils.js')

module.exports = {
    name: "settings",
    execute: (msg, Discord, help, GuildData) => {
        if (!msg.member.permissions.has('MANAGE_ROLES', true) || !utils.isOwner(msg.author.id)) {
            msg.channel.send(errors.NoPerms)
            return;
        }

        let name = msg.member.nickname;
        if (name === null) name = msg.author.username;
        let mess = JSON.parse(GuildData.Messages)
        if (mess.ApproveMess === null) mess.ApproveMess = { 'message': null, role: { add: null, remove: null } }
        if (mess.DeclineMess === null) mess.DeclineMess = { 'message': null, role: { add: null, remove: null } }
        GuildData.Messages = JSON.stringify(mess);
        if (!Array.isArray(JSON.parse(GuildData.fields))) GuildData.fields = JSON.stringify([]);
        if (!Array.isArray(JSON.parse(GuildData.Shop))) GuildData.Shop = JSON.stringify([]);
        if (help) {
            msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${name}`).addField('Użycie komendy', 'yui!settings <gałązki itd>').addField('Gałązki',
                `> **max** - Ustawia maksymalną liczbę postaci (Wymaga paczki RP)
            > **channel** - Ustawia kanał dla komendy 'chat'
            > **enable** / **disable** - Wyłącza / włącza funkcjonalność nie których komend (paczek).
            > **messages** - Jaką wiadomość wysłać po zakceptowaniu / odrzuceniu postaci?
            > **roles** - Jaką rolę dać po zakceptowaniu / odrzuceniu postaci?
            > **fields** - Pola postaci do rp (Wymaga paczki RP)
            Status 'paczek' sprawdzisz \`yui!settings enable\` lub \`yui!settings disable\`
            Help po gałązce żeby dowiedzieć się więcej`))
        } else {
            let interpenter = new StringReader(msg.content.substring('yui!settings'.length));
            interpenter.skipSpaces()
            if (interpenter.getText().length == 0 || !interpenter.canRead()) {
                msg.channel.send('Przepraszam bardzo, czemu to jest puste... >.< \nWpisz `yui!settings help` Po więcej informacji!')
                return;
            }
            var sub = [];
            sub[0] = interpenter.readWord()
            switch (sub[0]) {
                case 'max':
                    if (GuildData.rpEnabled) {
                        sub[1] = interpenter.readWord()
                        switch (sub[1]) {
                            case 'set':
                                sub[2] = interpenter.readInt();
                                if (Math.sign(sub[2]) == 1) {
                                    let data = JSON.parse(GuildData.config)
                                    data.max = sub[2];
                                    GuildData.config = JSON.stringify(data)
                                    msg.channel.send('Ustawiono na ' + sub[2])
                                } else {
                                    msg.channel.send(errors.NumberBelowZero);
                                }
                                break;
                            case 'clear': {
                                let data = JSON.parse(GuildData.config)
                                data.max = sub[2];
                                GuildData.config = JSON.stringify(data)
                                msg.channel.send('Ustawiono na wartość domyślną, `3`')
                                break;
                            }
                            default:
                                msg.channel.send('Możesz mieć maksymalnie ' + JSON.parse(GuildData.config).max + ' postaci')
                                break;
                        }
                    } else {
                        msg.channel.send('Ta komenda jest zablokowana! Odblokuj paczkę RP, korzystając z komendy `yui!settings enable rp`')
                    }
                    break;
                case 'channel':
                    sub[1] = interpenter.readWord()
                    switch (sub[1]) {
                        case 'set':
                            sub[2] = msg.mentions.channels.first();
                            if (sub[2] != null) {
                                let data = JSON.parse(GuildData.config)
                                data.max = sub[2].id;
                                GuildData.config = JSON.stringify(data)
                                msg.channel.send('Kanał dla komendy `chat` Ustawiono na ' + sub[2])
                            } else {
                                msg.channel.send(errors.KillMe);
                            }
                            break;
                        case 'clear':
                            let data = JSON.parse(GuildData.config)
                            data.chatChannel = null;
                            GuildData.config = JSON.stringify(data)
                            msg.channel.send('Przywrócono wartość domyślną')
                            break;
                        default:
                            let channel = JSON.parse(GuildData.config).chatChannel == null ? '' : '<#' + JSON.parse(GuildData.config).chatChannel + '>'
                            if (JSON.parse(GuildData.config).chatChannel != null) {
                                msg.channel.send(`Wybrany kanał do rozmów z innnymi serwerami to ${channel}`)
                            } else {
                                msg.channel.send(`Nie wybrano kanału... Więc wybiorę domyślny ;3\nPatrz ${msg.guild.systemChannel ? msg.guild.systemChannel :
                                    '... Jednak nie... Nie wybiorę nic... Komenda `chat` nie będzie działać i zostaje wyłączona do czasu ustawienia kanału'}`)
                            }
                            break;
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
                        default:
                            msg.channel.send('Status:'
                                + `\n\`Rp\` - ${GuildData.rpEnabled ? 'włączone' : 'wyłączone'}`
                                + `\n\`Money\` - ${GuildData.MoneySystem ? 'włączone' : 'wyłączone'}`
                                + `\n\`Xp\` - ${GuildData.XPSystem ? 'włączone' : 'wyłączone'}`)
                            break;
                    }
                    break;
                case 'messages':
                    if (GuildData.rpEnabled) {
                        msg.channel.send('Nie długo to będzie UvU, pewnie w kolejnej aktualizacji!')
                        /*
                        sub[1] = interpenter.readWord();
                        switch (sub[1]) {
                            case 'aprove':
                                sub[2] = interpenter.readWord();
                                switch (sub[2]) {
                                    case 'set':
                                    case 'clear':
                                    default:
                                }
                                break;
                            case 'decline':
                                sub[1] = interpenter.readWord();
                                switch (sub[2]) {
                                    case 'set':
                                    case 'clear':
                                    default:
                                }
                                break;
                        }*/
                    } else {
                        msg.channel.send(errors.RPDisabled);
                    }
                    break;
                case 'roles':
                    if (GuildData.rpEnabled) {
                        msg.channel.send('Nie długo to będzie UvU, pewnie w kolejnej aktualizacji!')
                        /*
                        sub[1] = interpenter.readWord();
                        switch (sub[1]) {
                            case 'aprove':
                                sub[2] = interpenter.readWord();
                                switch (sub[2]) {
                                    case 'set':
                                    case 'clear':
                                    default:
                                }
                                break;
                            case 'decline':
                                sub[1] = interpenter.readWord();
                                switch (sub[2]) {
                                    case 'set':
                                    case 'clear':
                                    default:
                                }
                                break;
                        }*/
                    } else {
                        msg.channel.send(errors.RPDisabled);
                    }
                    break;
                case 'fields':
                    sub[1] = interpenter.readWord();
                    let gdFields = JSON.parse(GuildData.fields)
                    switch (sub[1]) {
                        case 'add':
                            sub[2] = interpenter.readQuotedString();
                            sub[3] = interpenter.readWord().toLowerCase();
                            sub[4] = interpenter.readWord().toLowerCase();
                            if (sub[3] != 'yes' && sub[3] != 'no') {
                                msg.channel.send(errors.KillMe);
                                return;
                            }
                            if (sub[4] != 'int' && sub[4] != 'point' && sub[4] != 'list' && sub[4] != 'string') {
                                msg.channel.send(errors.KillMe);
                                return;
                            }
                            let field = {
                                name: sub[2],
                                optional: sub[3],
                                type: sub[4],
                                id: gdFields.length + 1
                            }
                            gdFields.push(field);
                            GuildData.fields = JSON.stringify(gdFields);
                            msg.channel.send(`Dodano pole o nazwie **${'"' + sub[2] + '"'}**, które **${sub[3] == 'yes' ? 'jest' : 'nie jest'}** opcjonalne a jego typ to **${sub[4]}**`)
                            break;
                        case 'remove':
                            sub[2] = interpenter.readInt();
                            let fieldTD = gdFields.findIndex(elt => elt.id == sub[2]);
                            if (fieldTD == -1) {
                                msg.channel.send(errors.CantFind);
                                return;
                            } else {
                                let deletedField = gdFields.splice(fieldTD, 1)[0]
                                msg.channel.send(`Usuniętoa pole o nazwie **${'"' + deletedField.name + '"'}**, które **${deletedField.optional == 'yes' ? 'jest' : 'nie jest'}** opcjonalne a jego typ to **${deletedField.type}**`)
                            }
                            break;
                        default:
                            msg.channel.send(GuildData.fields)
                            break;
                    }
                    break;
            }
            return GuildData;
        }
    }
}