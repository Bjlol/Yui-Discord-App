const express = require('express'), app = express();
const yandex = require('yandex-translate')(process.env.YandexApiKey),
    fs = require('fs'), https = require('https'), Sequelize = require('sequelize');
const data = require('./data'), Errors = require('./errors.js'), commands = require('./commands.js')
    , utils = require('./utils.js'), StringReader = require('./stringReader.js');

//Page requests
app.get("/", (_request, response) => { response.send('Yui is up and running in the 90\'s'); });
setInterval(() => https.get(`https://${process.env.PROJECT_DOMAIN}.glitch.me/`), 250000);
app.listen(process.env.PORT);

//Prefixes
var prefix = {
    default: "yui!",
    admin: "yui!admin"
}
//Levels and such
var dbFile = './.data/datas.db';
const db = new Sequelize({ dialect: 'sqlite', storage: dbFile, logging: false });
db.authenticate();

const levels = db.define('users', {
    id: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
    xp: { type: Sequelize.STRING, allowNull: false },
    lvl: { type: Sequelize.STRING, allowNull: false },
    userId: { type: Sequelize.STRING, allowNull: false }
})

const GRP = db.define('GuildsRPData', {
    guildId: { type: Sequelize.STRING, allowNull: false },
    fields: { type: Sequelize.STRING, allowNull: false },
    max: { type: Sequelize.INTEGER, allowNull: false },
    role: { type: Sequelize.INTEGER },
    AMessage: { type: Sequelize.STRING },
    DMessage: { type: Sequelize.STRING },
    MoneySystem: { type: Sequelize.BOOLEAN, allowNull: false },
    XPSystem: { type: Sequelize.BOOLEAN, allowNull: false },
    Shop: { type: Sequelize.STRING }
})

const Heroes = db.define('Heroes', {
    userId: { type: Sequelize.STRING, allowNull: false },
    guildId: { type: Sequelize.STRING, allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    fields: { type: Sequelize.STRING, allowNull: false },
    status: { type: Sequelize.INTEGER, allowNull: false }
})

GRP.sync();
Heroes.sync();
levels.sync();

//Discord Bot
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.userAttack = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//Events
client.on('ready', () => {
    let normal = { game: { name: 'Chat', type: 'watching' }, status: 'online' };
    let service = { game: { name: 'Przerwa techniczna :D', type: 'playing' }, status: 'idle' };
    client.user.setPresence(normal);
    console.log('Logged & synced');
});

client.on('message', msg => {
    if (msg.content.startsWith('yui!')) return;
    if (msg.author.bot) return;
    levels.count().then(ids => {
        levels.findOrCreate({ where: { userId: msg.author.id }, defaults: { id: ids + 1, xp: '0', lvl: '1', userId: msg.author.id } }).then(elt => {
            let data = elt[0].dataValues;
            data.xp = parseInt(data.xp) + utils.genRandom(1, 10);
            if (parseInt(data.xp) > parseInt(data.lvl) * 100) {
                data.xp = parseInt(data.xp) - 100;
                data.lvl = parseInt(data.lvl) + 1;
            }
            levels.update(data, { where: { userId: msg.author.id } });
        })
        levels.sync();
    })
})

client.on('message', msg => {
    var memberN = msg.member.nickname;
    if (memberN === null) memberN = msg.author.username;
    if (!(msg.content.startsWith(prefix.default))) return;
    var sReader = new StringReader(msg.content.substring(prefix.default.length));
    var command = sReader.readWord();
    var arg = [];
    arg[0] = sReader.readWord();
    arg[1] = sReader.readWord();
    arg[2] = sReader.readWord();
    var parsedArg = ~~arg[0] == 0 ? undefined : ~~arg[0];
    switch (command) {
        case 'dice':
            client.commands.get('dice').execute(msg, parsedArg, Discord, arg[0] == 'help');
            break;
        case 'ping':
            client.commands.get('ping').execute(msg, arg[0] == 'help');
            break;
        case 'ship':
            client.commands.get('ship').execute(msg, [arg[0], arg[1]], arg[0] == 'help');
            break;
        case 'npc':
            client.commands.get('npc').execute(msg, Discord, arg[0] == 'help');
            break;
        case 'place':
            client.commands.get('place').execute(msg, Discord, arg[0] == 'help');
            break;
        case 'translate':
            var lang = arg[0], text = msg.content.split(' ').slice(2).join(" ");
            client.commands.get('translate').execute(msg, [lang, text], yandex, Discord, arg[0] == 'help');
            break;
        case 'addme':
            client.commands.get('addme').execute(msg, arg[0] == 'help');
            break;
        case 'lyrics':
            client.commands.get('lyrics').execute(msg, msg.content.split(' ').slice(1).join(" "), arg == 'help')
            break;
        case 'atak':
            var outcome = client.commands.get('atak').execute(msg, arg[0], arg[1], arg[2], Discord, memberN, arg[0] == 'help', client.userAttack)
            if (outcome) {
                let userColl = client.userAttack.get(outcome.user) || { plus: 0, minus: 0 }
                if (outcome.outcome) userColl.plus++;
                else userColl.minus++;
                client.userAttack.set(outcome.user, userColl)
            }
            break;
        case 'time':
            client.commands.get('time').execute(msg, arg[1], Discord, arg[0] == 'help');
            break;
        case 'unik':
            client.commands.get('unik').execute(msg, arg[0], Discord, memberN, arg[0] == 'help')
            break;
        case 'profile':
            client.commands.get('profile').execute(msg, memberN, Discord, levels, arg[0] == 'help')
            break;
    }

    if (msg.author.id == '344048874656366592') {
        var YuiGuildMember = msg.guild.members.find(member => member.id === '551414888199618561')
        if (msg.content.startsWith('yui!command')) client.commands.get('owner_command').execute(msg, YuiGuildMember);

        if (msg.content.startsWith('yui!spam')) {
            var num = command[1], textArray = command.slice(2);
            client.commands.get('owner_spam').execute(msg, num, textArray.join(' '))
        }
        if (msg.content.startsWith('yui!hero')) {
            let GuildData = GRP.findOrCreate({
                where: { guildId: msg.guild.id }, defaults: {
                    guildId: msg.guild.id,
                    fields: {},
                    max: 3,
                    role: null,
                    AMessage: null,
                    DMessage: null,
                    MoneySystem: false,
                    XPSystem: false,
                    Shop: {},
                }
            });
            client.commands.get('hero').execute(msg, memberN, Discord, GuildData, 'Name', arg[0] == 'help')
        }
    }

    GRP.sync();
    Heroes.sync();
    levels.sync();
});

client.on('message', msg => {
    var YuiGuildMemberName = msg.guild.members.find(member => member.id === '551414888199618561').nickname;

    if ((msg.isMemberMentioned(client.user) && !msg.mentions.everyone &&
        (msg.cleanContent === `@${client.user.username}` || msg.cleanContent === `@${YuiGuildMemberName}`))
        && !msg.author.bot || msg.content.startsWith('yui!help')) {
        var embed = new Discord.RichEmbed().setColor('RANDOM')
            .setTitle('Pomoc dla Yui! (Czyli mnie), wersja 1.8')
            .addField('UWAGA!', 'Przed każdą komendą dodaj `yui!`')
            .addField('For fun', '`ship`, `translate`, `lyrics`')
            .addField('Gify', '`kiss`,`hug`, `slap`, `cookie`, `cry`, `cheer`, `pat`, `angry`, `smile`,  `cat`')
            .addField('Inne', '`addme`, `ping`, `profile`')
            .addField('Roleplay', '`dice`, `atak`, `unik`')
            .addField('Administracyjne', '`time`, `npc`, `place`')
            .addField('Output komendy :', '`[argument]` - nie wymagany, `<argument>` - wymagany')
            .addField('Pomoc dla komendy: ', 'yui!<komenda> help');
        msg.channel.send(embed);
    }
});

//Reakcje, gify i słodkie rzeczy.

client.on('message', msg => {
    if (!(msg.content.startsWith('yui!'))) return;
    var command = msg.content.substring('yui!'.length).split(' ').filter(element => element);

    //Variables
    var everyone = false, self = false, memberMentionedName;
    var memberUser = msg.member.nickname;
    if (memberUser === null) memberUser = msg.author.username;
    let mention = require('./mention.js')(msg);

    if (mention.everyone) everyone = true;
    if (mention.member) {
        if (msg.author.id == msg.mentions.members.first().id) {
            msg.channel.send(Errors.MentionSelf)
            return;
        }
        memberMentionedName = msg.mentions.members.first().nickname;
        if (memberMentionedName == null) memberMentionedName = msg.mentions.members.first().user.username;
    }
    if (mention.self) self = true;

    switch (command[0]) {
        case 'kiss':
            client.commands.get("kiss").execute(msg, [memberUser, memberMentionedName], command[1] == 'help');
            break;
        case 'hug':
            client.commands.get("hug").execute(msg, [memberUser, memberMentionedName], command[1] == 'help');
            break;
        case 'slap':
            client.commands.get("slap").execute(msg, [memberUser, memberMentionedName], command[1] == 'help');
            break;
        case 'cry':
            client.commands.get("cry").execute(msg, [memberUser, memberMentionedName], command[1] == 'help');
            break;
        case 'cheer':
            client.commands.get("cheer").execute(msg, [memberUser, memberMentionedName], command[1] == 'help');
            break;
        case 'pat':
            client.commands.get("pat").execute(msg, [memberUser, memberMentionedName], command[1] == 'help');
            break;
        case 'angry':
            client.commands.get("angry").execute(msg, [memberUser, memberMentionedName], command[1] == 'help');
            break;
        case 'smile':
            client.commands.get("smile").execute(msg, [memberUser, memberMentionedName], command[1] == 'help');
            break;
        case 'cookie':
            client.commands.get("cookie").execute(msg, [memberUser, memberMentionedName], command[1] == 'help');
            break;
        case 'cat':
            client.commands.get("cat").execute(msg, memberUser, command[1] == 'help');
            break;
    }
});

client.login(process.env.SECRET);