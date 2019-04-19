const http = require('http');
const express = require('express');
const app = express();
const data = require('./data')[0];
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Sequelize = require('sequelize');
const GuildBase = require('./guilds.js');
const Errors = require('./errors.js');
const database = require('./database.js');
const yandex = require('yandex-translate')(process.env.YandexApiKey);
const uuidV5 = require('uuid/v5');

//Login to database
database.authenticate().catch(err => console.error('Unable to connect to the database:', err));

//Creating table 'Guilds' & syncing
const Guilds = database.define('Guilds', GuildBase);

app.get('/data', (req, res) => res.send(data));
app.get("/", (request, response) => response.send('Yui is up and running in the 90\'s'));

//Gif base
var gif_hug = data.hug, gif_kiss = data.kiss, gif_slap = data.slap,
    gif_cry = data.cry, gif_pat = data.pat, gif_cheer = data.cheer,
    gif_kill_self = data.kill_self, gif_kill_other = data.kill_other, gif_angry = data.angry,
    gif_smile = data.smile, gif_nani = data.nani, gif_sao_sandwich = data.sao_sandwich,
    gif_sao_run = data.sao_run, gif_ban = data.ban, gif_sao_eat = data.sao_eat,
    answer_wojownik = data.wojownik_poluj, gif_cookie = data.cookie, ships = data.ship;

//Errors
var AirShip = Errors[0], NoMention = Errors[1], MentionSelf = Errors[2], WrongMention = Errors[3],
    NoArg = Errors[4], KillMe = Errors[5], CantDelete = Errors[6], NoPerms = Errors[7], WrongLang = Errors[8];
app.listen(process.env.PORT);

setInterval(() => http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`), 250000);

//Discord Bot
const Discord = require('discord.js');
const client = new Discord.Client();

var CryingYui = 'https://cdn.glitch.com/57f4b50a-0b6d-4097-963c-d1250b7bf4fd%2Fimage.png?1553974767652';

//Events
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ game: { name: 'Chat', type: 'watching'}, status: 'online' });
  client.guilds.array().forEach(guild => Guilds.findOrCreate({where: {guildId: guild.id}, defaults: { "welcomeEnabled": false, "autoroleEnabled": false }}));
  Guilds.sync();
});

client.on('guildMemberAdd', member => {
  Guilds.findOne({where : {guildId: member.guild.id} }).then(base => {
    if(base.welcomeEnabled) {
      var channelToSend = member.guild.channels.find(channel => channel.id == base.welcomeChannel);
      var message = base.welcomeMessage
        .replace('<el>', 'ł').replace('<a>', 'ą').replace('<ci>', 'ć').replace('<e>', 'ę')
        .replace('<ni>', 'ń').replace('<si>', 'ś').replace('<o>', 'ó').replace('<MEMBER>', `<@${member.id}>`)
      channelToSend.send(message);
    }
    if(base.autoroleEnabled) member.addRole(member.guild.roles.find(role => role.id == base.autoroleId));
  })
})

client.on('message', msg => {
  var memberN = msg.member.nickname, randomNumber, answer;
  if(memberN === null) memberN = msg.author.username;
  if(!(msg.content.startsWith('yui!'))) return;
  var command = msg.content.substring('yui!'.length).split(' ').filter(element => element);
  
  switch(command[0]) {
    case 'kostka':
      randomNumber = genRandom(7);
      if(randomNumber == 0) randomNumber += 1; 
      msg.channel.send(new Discord.RichEmbed().setTitle('Witaj ' + memberN).setColor('RANDOM').addField('Rzuciłeś kostką!', 'Wyrzuciłeś `' + randomNumber + '`'));
      break;
    case 'ping':
      msg.channel.send("Sprawdzam...").then((mess) => {mess.edit("Mój ping to: " + (Date.now() - msg.createdTimestamp))});
      break;
    case 'ship':
      if(command[1] === undefined || command[2] === undefined) {
        msg.channel.send(AirShip);
        return;
      }
      randomNumber = (process.env.SECRET.length * command[1].length * toBin(command[2])) % 100;
      if(command[1] == 'Kirito' && command[2] == 'Asuna' || command[2] == 'Kirito' && command[1] == 'Asuna') randomNumber = 100;
      if(randomNumber >= 0 && randomNumber < 20) answer = ships[0];
      if(randomNumber >= 20 && randomNumber < 40) answer = ships[1];
      if(randomNumber >= 40 && randomNumber < 60) answer = ships[2];
      if(randomNumber >= 60 && randomNumber < 80) answer = ships[3];
      if(randomNumber >= 80 && randomNumber < 100) answer = ships[4];
      if(randomNumber == 100) answer = ':heart: Też tak uważam :heart:';
      
      msg.channel.send(`:heart: Sprawdzam :heart: \n - ${command[1]} \n - ${command[2]} \n${randomNumber}% - ${answer}`);
      break;
    case 'lenny':
      msg.channel.send(new Discord.RichEmbed().addField('Czyżby szykowało się coś niecnego ( ͡° ͜ʖ ͡°) ?', '( ͡° ͜ʖ ͡°)( ° ͜ʖ °)( ͡~ ͜ʖ ͡°)( ♥ ͜ʖ ♥)').setColor('RANDOM'));
      break;
    case 'servers':
      msg.channel.send(new Discord.RichEmbed().setTitle('Sword Art Online RP').addField('Zaproszenie :', 'https://discord.gg/wHWjEsA')
                       .addField('Mój drugi domek!', 'PS. Jestem tam jedynym botem!').setColor('RANDOM'));
      msg.channel.send(new Discord.RichEmbed().setTitle('KRD.Online').addField('Zaproszenie :', 'https://discord.gg/wHWjEsA')
                       .addField('Discord serwera Minecraft', 'PS. Pracuje tam mój kolega (KRD.Bot)').setColor('RANDOM'));
      break;
    case 'mess':
      msg.channel.send(createGifEmbed('', 'https://cdn1.tnwcdn.com/wp-content/blogs.dir/1/files/2016/05/Messenger-Flowers.jpg')
                     .addField('Yui na Messengerze!', 'Tak możesz pogadać ze mną także w Messengerze!')
                       .addField('Linkacz :', 'http://m.me/cpylo').setColor('RANDOM'));
      break;
    case 'npc':
      var msgContent = msg.content.substring('yui!npc '.length);
      var args = msgContent.split(' '), number = parseInt(args[0]), whoText = args.slice(1, number + 1).join(" "), text = args.slice(1 + number).join(" ");
      msg.channel.send(new Discord.RichEmbed().addField('NPC :', `\`\`\`${whoText}\`\`\``).addField('Czynność :', `\`\`\`${text}\`\`\``).setColor('RANDOM'));
      break;
    case 'place':
      text = msg.content.substring('yui!place '.length);
      msg.channel.send(new Discord.RichEmbed().addField('Miejsce', `\`\`\`${msg.channel.name.replace('-', ' ')}\`\`\``)
                       .setColor('RANDOM').addField('Co :', `\`\`\`${text}\`\`\``));
      break;
    case 'tabelka':
      var value = parseInt(command[1]);
      if(value > 50) {
        msg.channel.send(KillMe);
        return;
      }
      for(var x = 0; x < value; x++) {msg.channel.send('``` ```')}
      break;
    case 'translate':
      var lang = command[1], text = command.slice(2).join(" ");
      yandex.detect(text , (err, res) => {
        var baseLang = res.lang;
        yandex.translate(text, {from: baseLang, to: lang }, (err, res) => {
          if(res.text == undefined){
            msg.channel.send(WrongLang);
            return;
          }
          msg.channel.send(new Discord.RichEmbed().setTitle(`O to twój przetłumaczony text, ${memberN}`)
                           .addField('Język bazowy :', `\`${baseLang}\``, true).addField('Tekst bazowy :', `\`${text}\``, true).addBlankField()
                           .addField('Język docelowy :', `\`${lang}\``, true).addField('Tekst przetłumaczony', `\`${res.text[0]}\``, true).setColor('RANDOM'));
        });
      });
      break;
    case 'assistant':
      var request = new XMLHttpRequest(), text = msg.content.substring('yui!assistant '.length),
          sessionId = uuidV5(msg.author.avatarURL, uuidV5.URL);
      request.open("GET", `${process.env.DialogFlow}/demoQuery?q=${text}&sessionId=${sessionId}`, true);
      request.onload = function() { 
        //var responseText =
        console.log(JSON.parse(this.responseText));
        //.result.fulfillment.speech;
        //msg.channel.send(new Discord.RichEmbed().addField(`Odpowiedź dla ${memberN} :`, responseText).setColor('RANDOM'))
      }
      request.send();
      break;
    case 'addme':
      msg.channel.send('https://discordapp.com/api/oauth2/authorize?client_id=551414888199618561&scope=bot&permissions=8')
      break;
  }
  
if(msg.author.id == '344048874656366592') {
  var YuiGuildMember = msg.guild.members.find(member =>  member.id === '551414888199618561')
  if(msg.content.startsWith('yui!command')){
    if(YuiGuildMember.missingPermissions('MANAGE_MESSAGES')[0] != 'MANAGE_MESSAGES') {
      text = msg.content.substring('yui!command '.length);
      msg.channel.send(text).then(msg.delete(0));
    } else {
      msg.channel.send(CantDelete);
      return;
    }
  }
  if(msg.content.startsWith('yui!spam')) {
    var num = command[1], textArray = command.slice(2), text = '', i = 0;
    textArray.forEach(arg => { text += arg + ' '; })
    for(i = 0; i < num; i++) {msg.channel.send(text);}
  }
}});

client.on('message', msg => {
  var YuiGuildMemberName = msg.guild.members.find(member =>  member.id === '551414888199618561').nickname;
  
  if((msg.isMemberMentioned(client.user) && !msg.mentions.everyone &&
      (msg.cleanContent === `@${client.user.username}` || msg.cleanContent === `@${YuiGuildMemberName}`))
     && !msg.author.bot || msg.content.startsWith('yui!help') ){
    var embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle('Pomoc dla Yui! (Czyli mnie), wersja 1.7')
    .addField('UWAGA!', 'Przed każdą komendą dodaj `yui!` chyba że jest napisane inaczej.')
    .addField('For fun', '`ship`, `lenny`, `tabelka`, `translate`, `assistant`')
    .addField('Gify', '`giphy`,`kiss`,`hug`, `slap`, `cookie`, `cry`, `cheer`, `pat`, `kill`, `angry`, `smile`, `nani`, `ban`, `cat`')
    .addField('Inne', '`servers`, `mess`, `addme`')
    .addField('Roleplay', '`ping`, `kostka`, `npc`')
    .addField('Wojownicy RP (Koty), prefix - `yui!wojownik`', '`poluj`')
    .addField('Komendy związane z SAO, prefix - `yui!sao`', '`sandwich`, `eat`, `run`')
    .addField('Administracyjne : prefix - `yui!admin`', '`welcome`, `autorole`');
    msg.channel.send(embed);
  }
});

client.on('message', msg => {
  if(!msg.content.startsWith('yui!admin')) return '';
  var command = msg.content.substring('yui!admin '.length).split(' ').filter(element => element);
  if(!(msg.member.missingPermissions('ADMINISTRATOR')[0] != 'ADMINISTRATOR')) {
        msg.channel.send(NoPerms);
        return;
  }
  switch(command[0]) {
    case 'welcome':
      var guildID = msg.channel.guild.id;
      if(command[2] == null || command[2] == undefined) {
        msg.channel.send(new Discord.RichEmbed()
                         .setColor('RANDOM')
                         .setTitle('Aktualizacja ustawień')
                         .addField('Kanał do wysyłania wiadomości :', 'Przywrócono domyślne')
                         .addField('Wiadomość :', 'Przywrocono domyślne'));
        Guilds.update({ "welcomeEnabled": false, "welcomeChannel": null, "welcomeMessage": null}, { where: { guildId: guildID }})
        return;
      }
      var channel = msg.mentions.channels.first().id, messageArray = command.slice(2), message = '';
      messageArray.forEach(fragment => { message += fragment + ' '; })
      msg.channel.send(new Discord.RichEmbed()
                         .setColor('RANDOM')
                         .setTitle('Aktualizacja ustawień')
                         .addField('Kanał do wysyłania wiadomości :', `<#${channel}>`)
                         .addField('Wiadomość :', message));
      message = message.replace('ł', '<el>').replace('ą', '<a>')
        .replace('ć', '<ci>').replace('ę', '<e>')
        .replace('ń', '<ni>').replace('ś', '<si>')
        .replace('ó', '<o>')
      Guilds.update({ "welcomeEnabled": true, "welcomeChannel": channel, "welcomeMessage": message}, {where: { guildId: guildID } });
      Guilds.sync();
      break;
    case 'autorole':
      var role = msg.mentions.roles.first(), guildID = msg.guild.id;
      if(role == null || role == undefined) {
        Guilds.update({ "autoroleEnabled": false, "autoroleId": null}, {where: { guildId: guildID }})
        msg.channel.send(new Discord.RichEmbed()
                         .setColor('RANDOM')
                         .setTitle('Aktualizacja ustawień')
                         .addField('Rola do automatycznego dawania :', 'Przywrócono domyślne'));
        return;
      }
      role = role.id;
      Guilds.update({ "autoroleEnabled": true, "autoroleId": role}, {where: {guildId: guildID }})
      msg.channel.send(new Discord.RichEmbed()
                         .setColor('RANDOM')
                         .setTitle('Aktualizacja ustawień')
                         .addField('Rola do automatycznego dawania :', `<@&${role}>`));
      break;
    case 'verify':
      var role = msg.mentions.roles.first(), guildID = msg.guild.id;
      if(role == null || role == undefined) {
        Guilds.update({ "verifyEnabled": true, "verifyRoleId": role}, {where: { guildId: guildID }})
        msg.channel.send(new Discord.RichEmbed()
                         .setColor('RANDOM')
                         .setTitle('Aktualizacja ustawień')
                         .addField('Rola dawana po przejściu weryfikacji :', 'Przywrócono domyślne'));
        return;
      }
      role = role.id;
      Guilds.update({ "verifyEnabled": true, "verifyRoleId": role}, {where: {guildId: guildID }})
      msg.channel.send(new Discord.RichEmbed()
                         .setColor('RANDOM')
                         .setTitle('Aktualizacja ustawień')
                         .addField('Rola dawana po przejściu weryfikacji :', `<@&${role}>`));
      break;
  }
  Guilds.sync();
})
//Reakcje, gify i słodkie rzeczy.

client.on('message', msg => {
  if(!msg.content.startsWith('yui!')) return '';
  var msgContent = msg.content.substring('yui!'.length);
  if(!(msgContent.startsWith('slap') || msgContent.startsWith('kiss') ||
     msgContent.startsWith('hug') || msgContent.startsWith('cry') ||
     msgContent.startsWith('pat') || msgContent.startsWith('cheer') ||
     msgContent.startsWith('cookie') || msgContent.startsWith('kill') ||
     msgContent.startsWith('sao') || msgContent.startsWith('nani') ||
     msgContent.startsWith('smile') || msgContent.startsWith('angry') ||
     msgContent.startsWith('wojownik') || msgContent.startsWith('cat') ||
     msgContent.startsWith('giphy') || msgContent.startsWith('ban'))) return;
  
  //Variables
  var gif, everyone = false, self = false, memberMentionedUser, memberMentionedName;
  var command = msgContent.split(' ');
  var memberUser = msg.member.nickname;
  if(memberUser === null) memberUser = msg.author.username;
  
  memberMentionedUser = msg.mentions.members.first();
  var mentionType = AllOrOneOrAlone(msg.mentions);
  
  if (mentionType == 'E') everyone = true;
  if (mentionType == 'O') {
    memberMentionedName = memberMentionedUser.nickname;
    if(memberMentionedName == null) memberMentionedName = memberMentionedUser.user.username;
    if(memberMentionedName == memberUser) {
      msg.channel.send(MentionSelf);
      return;
    }
  }
  if (mentionType == 'S') self = true;
  
  switch(command[0]) {
  case 'giphy':
    if(mentionType != 'S') {
      msg.channel.send(WrongMention);
    } else {
      var request = new XMLHttpRequest(), imageUrl = '';
      request.open("GET", `http://api.giphy.com/v1/gifs/random?tag=${command[1]}&api_key=${process.env.GiphyApiKey}`, true);
      request.onload = function() {
        imageUrl = JSON.parse(this.responseText).data.images.original.url;
        msg.channel.send(createGifEmbed(`O to gif dla ciebie, ${memberUser}`, imageUrl));
      }
      request.send();
    }
    break;
  case 'ban':
    if(mentionType != 'O') {
      msg.channel.send(WrongMention);
      return;
    } else {
      gif = gif_ban[genRandom(gif_ban.length)]
      msg.channel.send(createGifEmbed(`${memberUser} : Zbanujmy ${memberMentionedName}!`, gif))
    }
    break;
  case 'kiss':
    if(mentionType != 'O') {
      msg.channel.send(WrongMention);
      return;
    } else {
      gif = gif_kiss[genRandom(gif_kiss.length)]
      msg.channel.send(createGifEmbed(`${memberMentionedName} został pocałowany przez ${memberUser}`, gif));
      break;
    }
  case 'hug':
    if (mentionType != 'O') { 
      msg.channel.send(WrongMention);
      return;
    } else {
      gif = gif_hug[genRandom(gif_hug.length)];
      msg.channel.send(createGifEmbed(`${memberMentionedName} został przytulony przez ${memberUser}`, gif));
      break;
    }
  case 'slap':
    if (mentionType != 'O') {
      msg.channel.send(WrongMention);
      return;
    } else {
      if(memberMentionedUser.id == '344048874656366592') {
        if(msg.author.id != '517068183102816268') {
        msg.channel.send(createGifEmbed('Nie pozwole skrzywdzić mojego tatusia!', CryingYui));
        return;
        }
      }
      // Nie zmieniaj bo stracisz Meganke.
      if(memberMentionedUser.id == '517068183102816268') {
        msg.channel.send(createGifEmbed('Nie pozwole skrzywdzić mojej mamusi!', CryingYui));
        return;
      }
        gif = gif_slap[genRandom(gif_slap.length)];
        msg.channel.send(createGifEmbed(`${memberMentionedName} został uderzony przez ${memberUser}`, gif));
      
      break;
    }
  case 'cry':
    if (mentionType == 'E') {
      msg.channel.send(WrongMention);
      return;
    } else {
      gif = gif_cry[genRandom(gif_cry.length)];
      if(self) {
        msg.channel.send(createGifEmbed(`${memberUser} płacze`, gif));
      } else {
        msg.channel.send(createGifEmbed(`${memberUser} płacze przez ${memberMentionedName}`, gif));
      }
      break;
    }
  case 'cheer': 
    if (mentionType != 'O') {
      msg.channel.send(WrongMention);
      return;
    } else {
      gif = gif_cheer[genRandom(gif_cheer.length)];
      msg.channel.send(createGifEmbed(`${memberUser} pociesza ${memberMentionedName}!`, gif));
      break;
    }
  case 'pat':
    if (mentionType != 'O') {
      msg.channel.send(WrongMention);
      return;
    } else {
      gif = gif_pat[genRandom(gif_pat.length)];
      msg.channel.send(createGifEmbed(`${memberUser} glaszcze ${memberMentionedName}`, gif));
      break;
    }
  case 'kill':
    if(mentionType == 'E') {
      msg.channel.send(WrongMention);
      return;
    } else {
      if(mentionType == 'O') {
      if(memberMentionedUser.id == '344048874656366592') {
        if(msg.author.id != '517068183102816268') {
        msg.channel.send(createGifEmbed('Nie pozwole skrzywdzić mojego tatusia!', CryingYui));
        return;
        }
      }
      // Nie zmieniaj bo stracisz Meganke.
      if(memberMentionedUser.id == '517068183102816268') {
          msg.channel.send(createGifEmbed('Nie pozwole skrzywdzić mojej mamusi!', CryingYui));
          return;
      }
      gif = gif_kill_other[genRandom(gif_kill_other.length)];
      msg.channel.send(createGifEmbedWithColor(`${memberUser} zabija ${memberMentionedName}...`, 'RED', gif));
    } else {
      if(self) {
        gif = gif_kill_self[genRandom(gif_kill_self.length)];
        msg.channel.send(createGifEmbedWithColor(`${memberUser} popełnia samobójstwo...`, 'RED', gif));
      }
    }
  }
    break;
  case 'angry':
    if(mentionType != 'O') {
      msg.channel.send(WrongMention);
      return;
    } else {
      gif = gif_angry[genRandom(gif_angry.length)];
      msg.channel.send(createGifEmbed(`${memberUser} jest zly na ${memberMentionedName}`, gif));
      break;
    }
  case 'smile':
    if(mentionType != 'O') {
      msg.channel.send(WrongMention);
      return;
    } else {
      gif = gif_smile[genRandom(gif_smile.length)];
      msg.channel.send(createGifEmbed(`${memberUser} uśmiechnął się do ${memberMentionedName}`, gif));
      break;
    }
  case 'nani':
    if(mentionType != 'O') {
      msg.channel.send(WrongMention);
      return;
    } else {
      gif = gif_nani[genRandom(gif_nani.length)];
      msg.channel.send(createGifEmbed(`${memberMentionedName} COOOO?`, gif));
      break;
    }
  case 'cookie':
    if(mentionType == 'S') {
      msg.channel.send(WrongMention);
      return;
    }
    if (everyone) {
      gif = gif_cookie[genRandom(gif_cookie.length)];
      msg.channel.send(createGifEmbed('Ciasteczka dla wszystkich!', gif));
      break;
    } else {
      msg.channel.send(createGifEmbed("", null)
        .addField(`${memberMentionedName} dostal ciasteczko od ${memberUser}`,
          'UwU (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ :cookie:'))
      break;
    }
  case 'cat':
    if(mentionType != 'S') {
      msg.channel.send(WrongMention);
      return;
    } else {
      var request = new XMLHttpRequest(), imageUrl = '';
      request.open("GET", "https://api.thecatapi.com/v1/images/search?order=RANDOM&limit=1", true);
      request.onload = function() { 
        imageUrl = JSON.parse(this.responseText)[0].url;
        msg.channel.send(createGifEmbed(`O to koteczek dla ciebie, ${memberUser}`, imageUrl));
      }
      request.setRequestHeader('x-api-key', process.env.CatApiKey);
      request.send();
    }
  case 'sao':
    if (command[1] == 'sandwich' || command[1] == 'run') {
      if(mentionType != 'O') {
        msg.channel.send(WrongMention);
        return;
      } else {
        switch(command[1]) {
          case 'sandwich':
            gif = gif_sao_sandwich[genRandom(gif_sao_sandwich.length)];
            msg.channel.send(createGifEmbed(`${memberMentionedName} dostal kanapke od ${memberUser}`, gif));
            break;
          case 'run':
            gif = gif_sao_run[genRandom(gif_sao_run.length)];
            msg.channel.send(createGifEmbed(`${memberUser} ucieka od ${memberMentionedName}`, gif));
            break;
        }
      }
    }
    if (command[1] == 'eat') {
      if (mentionType != 'S') {
        msg.channel.send(WrongMention);
        return;
      } else {
        gif = gif_sao_eat[genRandom(gif_sao_eat.length)];
        msg.channel.send(createGifEmbed(`${memberUser} je jedzonko`, gif));
      }
    }
    break;
  case 'wojownik':
    if (command[1] == 'poluj') {
      if (mentionType != 'S') {
        msg.channel.send(WrongMention);
        return;
      } else {
        var odp = answer_wojownik[genRandom(answer_wojownik.length)];
        msg.channel.send(createGifEmbed("", null).addField(`${memberUser} upolował... *Werble proszę*`, odp))
      }
    }
}
  
  
});

function createGifEmbed(title, gif) { return new Discord.RichEmbed().setTitle(title).setColor('RANDOM').setImage(gif); }
function createGifEmbedWithColor(title, color, gif) { return new Discord.RichEmbed().setTitle(title).setColor(color).setImage(gif); }
    
client.login(process.env.SECRET);

function genRandom(num) { return Math.floor(Math.random() * num); }

function toBin(string) { 
  var bin = 0, i;
  for(i = 0; i < string.length; i++) bin += string[i].charCodeAt(0).toString(2);
  return bin;
}

function AllOrOneOrAlone(mentions) {
  var memberMentioned = mentions.members.first()
  var number = 2;

  if (mentions.everyone) number = 0;
  if (memberMentioned != undefined) number = 1;

  switch (number) {
      case 0 :
        return 'E';
        break;
      case 1 :
        return 'O';
        break;
      case 2 :
        return 'S';
        break;
  }
}
