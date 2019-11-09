const express = require("express"), app = express();
const yandex = require("yandex-translate")(process.env.YandexApiKey), fs = require("fs"), https = require("https"), Sequelize = require("sequelize");
const data = require("./data"), errors = require("./errors.js"), commands = require("./commands.js"), utils = require("./utils.js"),
  StringReader = require("./stringReader.js"), bodyParser = require('body-parser');;

//Page requests
app.use(express.static("webpage"), express.urlencoded({ extended: true }))
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
    return acc + `{ name: ${value.name}, id: ${value.id} }`;
  }, "");
  response.send(text);
});
app.get("/hero", (_request, response) => { response.sendFile(__dirname + '/webpage/templateHero.html') })
app.get("/edithero", (request, response) => {
  Heroes.findOne({ where: { id: request.query.id } }).then(elt => {
    if (!elt) {
      response.sendFile(__dirname + '/webpage/findless.html')
    } else {
      if (elt.userId == request.query.uid) {
        response.sendFile(__dirname + '/webpage/templateEditHero.html')
      } else {
        response.sendFile(__dirname + '/webpage/noperms.html')
      }
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
      .findOrCreate({
        where: { userId: msg.author.id },
        defaults: { id: ids + 1, xp: "0", lvl: "1", userId: msg.author.id }
      })
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
  var memberN = msg.member.nickname || msg.author.username;
  if (!msg.content.startsWith(prefix.default)) return;
  var sReader = new StringReader(msg.content.substring(prefix.default.length));
  var command = sReader.readWord();
  var arg = [];
  let outcome;
  arg[0] = sReader.readWord();
  arg[1] = sReader.readWord();
  arg[2] = sReader.readWord();
  Yui.Discord = Discord;
  if (command == "settings") Yui.GuildData = GData;
  if (command == "ranking" || command == "profile") Yui.levels = levels;
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
        Heroes.findAll({ where: { guildId: msg.guild.id, userId: msg.author.id } }).then(heroesData => {
          let returnData = Yui.commands.get("hero")
            .execute(Yui, msg, memberN, guildData[0].dataValues, heroesData, arg[0] == "help");
          if (!returnData) return;
          switch (returnData.action) {
            case "create":
              Heroes.create(returnData.data);
              break;
            case "remove":
              Heroes.destroy({ where: { id: returnData.data } });
              break;
            case "info":
              msg.channel.send(`Zobacz swoją postać na http://yui-discord-bot.glitch.me/hero?id=${returnData.data}`);
              break;
            case "edit":
              msg.author.send(`Edytuj swoją postać na: http://yui-discord-bot.glitch.me/edithero?id=${returnData.data}&uid=${msg.author.id}`)
              break;
            case "status":
              Heroes.findOne({ where: { id: returnData.data } }).then(data => {
                if (data == null) {
                  msg.channel.send(
                    `No sorka! Ale nie mogę znaleźć postaci o id **${returnData.data}** \nMoże pomyliłeś serwery ¯\\_(ツ)_/¯`
                  );
                  return;
                }
                data = data.dataValues;
                let status = utils.getStatus(data.status);
                msg.channel.send(
                  `Status postaci o nazwie **${data.name}** to **${status}**`
                );
              });
              break;
            case "list":
              Heroes.findAll({
                where: {
                  userId: returnData.data.uid,
                  guildId: returnData.data.gid
                }
              }).then(data => {
                let mess = data.reduce((sum, acc) => {
                  return (
                    sum +
                    `**${acc.dataValues.name}**, id: ${acc.dataValues.id}\n`
                  );
                }, "");
                if (mess == "")
                  msg.channel.send(
                    new Discord.RichEmbed()
                      .setTitle(`Witaj, ${memberN}`)
                      .addField(
                        "Sorka! Ale ten użytkownik nie ma żadnych postaci",
                        "Shift happens"
                      )
                  );
                else
                  msg.channel.send(
                    new Discord.RichEmbed()
                      .setTitle(`Witaj, ${memberN}`)
                      .addField("Lista postaci:", mess)
                  );
              });
              break;
            case "show":
              switch (returnData.data) {
                case "all":
                  Heroes.findAll({ where: { guildId: msg.guild.id } }).then(
                    data => {
                      if (data.length > 10) {
                        let arr = data.slice(returnData.id - 1 * 10, 10);
                        let mess = arr.reduce((sum, acc) => {
                          return (
                            sum +
                            `**${acc.dataValues.name}**, id: ${acc.dataValues.id}\n`
                          );
                        }, "");
                        msg.channel.send(
                          new Discord.RichEmbed()
                            .setTitle(`Witaj, ${memberN}`)
                            .addField("Lista postaci:", mess)
                        );
                      } else {
                        let mess = data.reduce((sum, acc) => {
                          return (
                            sum +
                            `**${acc.dataValues.name}**, id: ${acc.dataValues.id}\n`
                          );
                        }, "");
                        if (mess == "")
                          msg.channel.send(
                            new Discord.RichEmbed()
                              .setTitle(`Witaj, ${memberN}`)
                              .addField(
                                "Sorka! Ale nie ma żadnych zarejestrowanych postaci",
                                "Shift happens"
                              )
                          );
                        else
                          msg.channel.send(
                            new Discord.RichEmbed()
                              .setTitle(`Witaj, ${memberN}`)
                              .addField("Lista postaci:", mess)
                          );
                      }
                    }
                  );
                  break;
              }
              break;
            case "channelUpdate":
              let channel = msg.guild.channels.find(
                elt => elt.id == returnData.data.channel
              );
              if (!channel) {
                msg.channel.send(erorrs.CantFindChannel);
                return;
              }
              channel.fetchMessages().then(coll => {
                channel.bulkDelete(channel.messages).then(() => {
                  channel
                    .send(`yui!hero info ${returnData.data.id}`)
                    .then(msge => msge.delete(100));
                });
              });
          }
        });
      });
      break;
    case "radio":
      Yui.commands.get("radio").execute(Yui, msg);
      break;
    case "ranking":
      Yui.commands.get("ranking").execute(Yui, msg);
      break;
    case "keiko":
      Yui.commands.get("keiko").execute(Yui, msg);
      break;
    case "sex":
      Yui.commands.get("sex").execute(Yui, msg);
      break;
    case "hack":
      Yui.commands.get("hack").execute(Yui, msg);
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

Yui.on("message", msg => {
  var YuiGuildMemberName = msg.guild.members.find(
    member => member.id === "551414888199618561"
  ).nickname;

  if (
    (msg.isMemberMentioned(Yui.user) &&
      !msg.mentions.everyone &&
      (msg.cleanContent === `@${Yui.user.username}` ||
        msg.cleanContent === `@${YuiGuildMemberName}`) &&
      !msg.author.bot) ||
    msg.content.startsWith("yui!help")
  ) {
    var embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setTitle("Pomoc dla Yui! (Czyli mnie), wersja 2.0")
      .addField("UWAGA!", "Przed każdą komendą dodaj `yui!`")
      .addField("For fun", "`ship`, `translate`, `lyrics`")
      .addField(
        "Gify",
        "`kiss`,`hug`, `slap`, `cookie`, `cry`, `cheer`, `pat`, `angry`, `smile`,  `cat`"
      )
      .addField("Inne", "`addme`, `ping`, `profile`")
      .addField("Roleplay", "`dice`, `atak`, `unik`, hero")
      .addField("Administracyjne", "`time`, `npc`, `place`, `settings`")
      .addField(
        "Output komendy :",
        "`[argument]` - nie wymagany, `<argument>` - wymagany"
      )
      .addField("Pomoc dla komendy: ", "yui!<komenda> help");
    msg.channel.send(embed);
  }
});

//Reakcje, gify i słodkie rzeczy.

Yui.on("message", msg => {
  if (!msg.content.startsWith("yui!")) return;
  var command = msg.content
    .substring("yui!".length)
    .split(" ")
    .filter(element => element);

  //Variables
  var everyone = false,
    self = false,
    memberMentionedName;
  var memberUser = msg.member.nickname;
  if (memberUser === null) memberUser = msg.author.username;
  let mention = require("./mention.js")(msg);

  if (mention.everyone) everyone = true;
  if (mention.member) {
    if (msg.author.id == msg.mentions.members.first().id) {
      return;
    }
    memberMentionedName = msg.mentions.members.first().nickname;
    if (memberMentionedName == null)
      memberMentionedName = msg.mentions.members.first().user.username;
  }
  if (mention.self) self = true;

  switch (command[0]) {
    case "kiss":
      Yui.commands
        .get("kiss")
        .execute(msg, [memberUser, memberMentionedName], command[1] == "help");
      break;
    case "hug":
      Yui.commands
        .get("hug")
        .execute(msg, [memberUser, memberMentionedName], command[1] == "help");
      break;
    case "slap":
      Yui.commands
        .get("slap")
        .execute(msg, [memberUser, memberMentionedName], command[1] == "help");
      break;
    case "cry":
      Yui.commands
        .get("cry")
        .execute(msg, [memberUser, memberMentionedName], command[1] == "help");
      break;
    case "cheer":
      Yui.commands
        .get("cheer")
        .execute(msg, [memberUser, memberMentionedName], command[1] == "help");
      break;
    case "pat":
      Yui.commands
        .get("pat")
        .execute(msg, [memberUser, memberMentionedName], command[1] == "help");
      break;
    case "angry":
      Yui.commands
        .get("angry")
        .execute(msg, [memberUser, memberMentionedName], command[1] == "help");
      break;
    case "smile":
      Yui.commands
        .get("smile")
        .execute(msg, [memberUser, memberMentionedName], command[1] == "help");
      break;
    case "cookie":
      Yui.commands
        .get("cookie")
        .execute(msg, [memberUser, memberMentionedName], command[1] == "help");
      break;
    case "cat":
      Yui.commands.get("cat").execute(msg, memberUser, command[1] == "help");
      break;
  }
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
