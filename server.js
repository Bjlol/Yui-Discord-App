const express = require("express"), app = express();
const yandex = require("yandex-translate")(process.env.YandexApiKey), fs = require("fs"), https = require("https"), Sequelize = require("sequelize");
const data = require("./data"), errors = require("./errors.js"), utils = require("./utils.js"),
  StringReader = require("./stringReader.js");

//Page requests
app.use(express.static("webpage"));
app.get("/", (_request, response) => {
  response.sendFile(__dirname + "/webpage/main.html");
});

setInterval(() => {
  https.get(`https://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  https.get("https://keiko-assistant.glitch.me/");
}, 250000);
app.listen(process.env.PORT);

//Prefixes
var prefix = { default: "yui!" };

//Levels and such
var dbFile = "./.data/datas.db";
const db = new Sequelize({
  dialect: "sqlite",
  storage: dbFile,
  logging: false
});
db.authenticate();

const levels = db.define("users", {
  id: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
  xp: { type: Sequelize.STRING, allowNull: false },
  lvl: { type: Sequelize.STRING, allowNull: false },
  userId: { type: Sequelize.STRING, allowNull: false }
});

const GData = db.define("GuildsData", {
  guildId: { type: Sequelize.STRING, allowNull: false },
  fields: { type: Sequelize.STRING },
  config: { type: Sequelize.STRING, allowNull: false },
  Messages: { type: Sequelize.STRING },
  rpEnabled: { type: Sequelize.BOOLEAN, allowNull: false },
  MoneySystem: { type: Sequelize.BOOLEAN, allowNull: false },
  XPSystem: { type: Sequelize.BOOLEAN, allowNull: false },
  Shop: { type: Sequelize.STRING }
});

const Heroes = db.define("HeroesData_2_1", {
  equipment: { type: Sequelize.STRING },
  xp: { type: Sequelize.STRING },
  lvl: { type: Sequelize.STRING },
  money: { type: Sequelize.STRING },
  userId: { type: Sequelize.STRING, allowNull: false },
  guildId: { type: Sequelize.STRING, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  fields: { type: Sequelize.STRING },
  status: { type: Sequelize.INTEGER, allowNull: false },
  channelid: { type: Sequelize.STRING },
  imageLink: { type: Sequelize.STRING },
  id: { type: Sequelize.STRING, allowNull: false, primaryKey: true }
});

GData.sync();
Heroes.sync();
levels.sync();

app.get("/levels", (_request, response) => {
  levels.findAll().then(res => {
    res.sort((lelt, relt) => {
      if (relt.lvl - lelt.lvl != 0) return relt.lvl - lelt.lvl;
      else return relt.xp - lelt.xp;
    });
    response.send(res);
  });
});

app.get("/api/picture", (_request, response) => response.send(Yui.user.avatarURL));
app.get("/api/guilds", (_request, response) => {
  let text = Yui.guilds.reduce((acc, value) => {
    let acc1 = acc;
    let elt = {
      name: value.name, id: value.id,
      NumOfChannels: value.channels.size, NumOdMembers: value.members.size,
      NumOfEmojis: value.emojis.size, NumOfRoles: value.roles.size,
      owner: {
        id: value.ownerID,
        tag: value.owner.user.tag
      },
      icon: value.iconURL,
      isKeikoThere: value.members.find(elt => elt.id == "622783718783844356") ? true : false,
      region: value.region
    }
    acc1.push(elt);
    return acc1;
  }, []);
  response.send(text);
});
app.get("/dbfile", (_request, response) => {
  response.sendFile(__dirname + "/.data/datas.db")
})
app.get("/hero", (_request, response) => { response.sendFile(__dirname + '/webpage/templateHero.html') })
app.get("/edithero", (request, response) => {
  Heroes.findOne({ where: { id: request.query.id } }).then(elt => {
    if (!elt) response.sendFile(__dirname + '/webpage/findless.html')
    else {
      if (elt.userId == request.query.uid) response.sendFile(__dirname + '/webpage/templateEditHero.html')
      else response.sendFile(__dirname + '/webpage/noperms.html')
    }
  })
})
app.get("/api/hero", (request, response) => {
  Heroes.findOne({ where: { id: request.query.id } }).then(hero => {
    if (hero) {
      let editedHero = hero.dataValues;
      delete editedHero.createdAt;
      delete editedHero.updatedAt;
      response.send(editedHero)
    } else {
      response.send(null)
    }
  });
})
app.get("/api/guildsettings", (request, response) => {
  GData.findOne({ where: { guildId: request.query.id } }).then(settings => {
    let editedSettings = settings.dataValues;
    delete editedSettings.id;
    delete editedSettings.createdAt;
    delete editedSettings.updatedAt;
    response.send(editedSettings)
  });
})
app.get("/api/heroupdate", (request, response) => {
  Heroes.findOne({ where: { id: request.query.id } }).then(elt => {
    let hero = elt.dataValues;
    GData.findOne({ where: { guildId: hero.guildId } }).then(guild => {
      JSON.parse(decodeURIComponent(request.get('data'))).forEach(update => {
        switch (update.type) {
          case 'img':
            hero.imageLink = update.dane;
            break;
          case 'field':
            let parsedGFields = JSON.parse(guild.dataValues.fields);
            let parsedFields = JSON.parse(hero.fields);
            let temp = parsedFields.find(field => field.id == update.id);
            if (temp) {
              temp.data = update.dane;
              parsedFields[parsedFields.findIndex(field => field.id == update.id)] = temp
              hero.fields = JSON.stringify(parsedFields);
            } else {
              temp = { name: parsedGFields.find(felt => felt.id == update.id).name, data: update.dane, id: update.id }
              parsedFields.push(temp)
              hero.fields = JSON.stringify(parsedFields);
              break;
            }
        }
      })
      Heroes.update(hero, { where: { id: request.query.id } });
      response.send('Jest oke');
      Heroes.sync();
    })
  })
})


//Discord Bot
const Discord = require("discord.js");
const Yui = new Discord.Client();
Yui.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
Yui.userAttack = new Discord.Collection();

for (const file of commandFiles)
  Yui.commands.set(require(`./commands/${file}`).name, require(`./commands/${file}`));

//Events
Yui.on("ready", () => {
  let normal = { game: { name: "ludziuf", type: "watching" }, status: "online" };
  let service = { game: { name: "Przerwa techniczna :D", type: "playing" }, status: "idle" };
  Yui.user.setPresence(normal);
  console.log("Logged & synced");
});

Yui.on("message", msg => {
  if (msg.content.startsWith("yui!")) return;
  if (msg.author.bot) return;
  levels.count().then(ids => {
    levels
      .findOrCreate({ where: { userId: msg.author.id }, defaults: { id: ids + 1, xp: "0", lvl: "1", userId: msg.author.id } })
      .then(elt => {
        let data = elt[0].dataValues;
        data.xp = parseInt(data.xp) + utils.genRandom(1, 5);
        if (parseInt(data.xp) > parseInt(data.lvl) * 200) {
          data.xp = parseInt(data.xp) - 200;
          data.lvl = parseInt(data.lvl) + 1;
        }
        levels.update(data, { where: { userId: msg.author.id } });
      });
    levels.sync();
  });
});

Yui.on("message", msg => {
  let YuiGuildMemberName = "", mention = utils.mentions(msg), memberUser = msg.guild ? msg.member.nickname : null, memberMentionedName,
    sReader = new StringReader(msg.content.substring(prefix.default.length)), command = sReader.readWord(), arg = [], outcome;
  if (msg.guild) YuiGuildMemberName = msg.guild.members.find(member => member.id === "551414888199618561").nickname;
  else YuiGuildMemberName = "Yui";
  if ((msg.isMemberMentioned(Yui.user) && !msg.mentions.everyone && (msg.cleanContent === `@${Yui.user.username}` ||
    msg.cleanContent === `@${YuiGuildMemberName}`) && !msg.author.bot) || msg.content.startsWith("yui!help")) {
    var embed = new Discord.RichEmbed().setColor("RANDOM")
      .setTitle("Pomoc dla Yui! (Czyli mnie), wersja 2.1.0").addField("UWAGA!", "Przed każdą komendą dodaj `yui!`")
      .addField("For fun", "`ship`, `translate`, `lyrics`").addField("Gify",
        "`kiss`,`hug`, `slap`, `cookie`, `cry`, `cheer`, `pat`, `angry`, `smile`,  `cat`")
      .addField("Inne", "`addme`, `ping`, `profile`").addField("Roleplay", "`dice`, `atak`, `unik`, hero")
      .addField("Administracyjne", "`time`, `settings`").addField("Output komendy :",
        "`[argument]` - nie wymagany, `<argument>` - wymagany").addField("Pomoc dla komendy: ", "yui!<komenda> help");
    msg.channel.send(embed);
  }
  if (!msg.content.startsWith(prefix.default)) return;
  Yui.Discord = Discord;
  if (command == "settings") Yui.GuildData = GData;
  if (command == "ranking" || command == "profile") Yui.levels = levels;

  if (memberUser === null) memberUser = msg.author.username;
  if (mention.member) {
    if (msg.author.id != msg.mentions.members.first().id) {
      memberMentionedName = msg.mentions.members.first().nickname;
      if (memberMentionedName == null)
        memberMentionedName = msg.mentions.members.first().user.username;
    }
  }

  for (var i = 0; i < 4; i++) {
    arg.push(sReader.readWord())
  }

  switch (command) {
    case "dice":
      Yui.commands.get("dice").execute(Yui, msg);
      break;
    case "ping":
      Yui.commands.get("ping").execute(Yui, msg);
      break;
    case "ship":
      Yui.commands.get("ship").execute(Yui, msg);
      break;
    case "translate":
      Yui.commands.get("translate").execute(Yui, msg);
      break;
    case "addme":
      Yui.commands.get("addme").execute(Yui, msg);
      break;
    case "lyrics":
      Yui.commands.get("lyrics").execute(Yui, msg);
      break;
    case "atak":
      outcome = Yui.commands.get("atak").execute(Yui, msg);
      break;
    case "time":
      Yui.commands.get("time").execute(Yui, msg);
      break;
    case "unik":
      Yui.commands.get("unik").execute(Yui, msg);
      break;
    case "profile":
      Yui.commands.get("profile").execute(Yui, msg);
      break;
    case "settings":
      Yui.commands.get("settings").execute(Yui, msg);
      break;
    case "hero":
      GData.findOrCreate({
        where: { guildId: msg.guild.id },
        defaults: utils.getGDT(msg.guild.id)
      }).then(guildData => {
        Yui.commands.get("hero").execute(Yui, msg, memberUser, guildData[0].dataValues, Heroes, arg[0] == "help");
        Heroes.sync()
      });
      break;
    case "ranking":
      Yui.commands.get("ranking").execute(Yui, msg);
      break;
    case "keiko":
      Yui.commands.get("keiko").execute(Yui, msg);
      break;
    case "kiss":
      Yui.commands.get("kiss").execute(msg, [memberUser, memberMentionedName], arg[0] == "help");
      break;
    case "hug":
      Yui.commands.get("hug").execute(msg, [memberUser, memberMentionedName], arg[0] == "help");
      break;
    case "slap":
      Yui.commands.get("slap").execute(msg, [memberUser, memberMentionedName], arg[0] == "help");
      break;
    case "cry":
      Yui.commands.get("cry").execute(msg, [memberUser, memberMentionedName], arg[0] == "help");
      break;
    case "cheer":
      Yui.commands.get("cheer").execute(msg, [memberUser, memberMentionedName], arg[0] == "help");
      break;
    case "pat":
      Yui.commands.get("pat").execute(msg, [memberUser, memberMentionedName], arg[0] == "help");
      break;
    case "angry":
      Yui.commands.get("angry").execute(msg, [memberUser, memberMentionedName], arg[0] == "help");
      break;
    case "smile":
      Yui.commands.get("smile").execute(msg, [memberUser, memberMentionedName], arg[0] == "help");
      break;
    case "cookie":
      Yui.commands.get("cookie").execute(msg, [memberUser, memberMentionedName], arg[0] == "help");
      break;
    case "cat":
      Yui.commands.get("cat").execute(msg, memberUser, arg[0] == "help");
      break;
  }

  if (outcome) {
    switch (command) {
      case "atak":
        addOutcome(outcome);
        break;
    }
  }
  GData.sync();
  Heroes.sync();
  levels.sync();
});

Yui.login(process.env.SECRET);

function addOutcome(outcome) {
  if (outcome) {
    let userColl = Yui.userAttack.get(outcome.user) || { plus: 0, minus: 0 };
    if (outcome.outcome) userColl.plus++;
    else userColl.minus++;
    Yui.userAttack.set(outcome.user, userColl);
  }
}