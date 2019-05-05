const express = require('express'), app = express();
const Sequelize = require('sequelize'),
      yandex = require('yandex-translate')(process.env.YandexApiKey),
      uuidV5 = require('uuid/v5');
const https = require('https');
const data = require('./data'), GuildBase = require('./guilds.js')[0], Errors = require('./errors.js'),
      database = require('./database.js'), guildsDefaults = require('./guilds.js')[1], commands = require('./commands.js');

//Login to database then defining table
database.authenticate().catch(err => console.error('Unable to connect to the database:', err));
const Guilds = database.define('Guilds', GuildBase);

//Page requests
app.get("/", (request, response) => response.send('Yui is up and running in the 90\'s'));
setInterval(() => https.get(`https://${process.env.PROJECT_DOMAIN}.glitch.me/`), 250000);
app.listen(process.env.PORT);

var commandList = data.commands;

//Gif & anwsers base
var gif_hug = data.hug, gif_kiss = data.kiss, gif_slap = data.slap,
    gif_cry = data.cry, gif_pat = data.pat, gif_cheer = data.cheer,
    gif_kill_self = data.kill_self, gif_kill_other = data.kill_other, gif_angry = data.angry,
    gif_smile = data.smile, gif_nani = data.nani, gif_sao_sandwich = data.sao_sandwich,
    gif_sao_run = data.sao_run, gif_ban = data.ban, gif_sao_eat = data.sao_eat,
    answer_wojownik = data.wojownik_poluj, gif_cookie = data.cookie, ships = data.ship,
    CryingYui = 'https://cdn.glitch.com/57f4b50a-0b6d-4097-963c-d1250b7bf4fd%2Fimage.png?1553974767652';

//Errors
var AirShip = Errors[0], NoMention = Errors[1], MentionSelf = Errors[2], WrongMention = Errors[3],
    NoArg = Errors[4], KillMe = Errors[5], CantDelete = Errors[6], NoPerms = Errors[7], WrongLang = Errors[8];

//Discord Bot
const Discord = require('discord.js');
const client = new Discord.Client();

//Events
client.on('ready', () => {
  client.user.setPresence({ game: { name: 'Chat', type: 'watching'}, status: 'online' });
  client.guilds.array().forEach(guild => Guilds.findOrCreate({ where: {guildId: guild.id}, defaults: guildsDefaults}));
  Guilds.sync();
  console.log('Logged & synced');
});

client.on('guildMemberAdd', member => {
  Guilds.findOne({where : {guildId: member.guild.id} }).then(base => {
    if(base.welcomeEnabled) member.guild.channels.find(channel => channel.id == base.welcomeChannel)
      .send(decodeURI(base.welcomeMessage).replace('<MEMBER>', `<@${member.id}>`));
    if(base.autoroleEnabled) member.addRole(member.guild.roles.find(role => role.id == base.autoroleId));
  })
})

client.on('message', msg => {
  var memberN = msg.member.nickname, randomNumber, answer;
  if(memberN === null) memberN = msg.author.username;
  if(!(msg.content.startsWith('yui!'))) return;
  var command = msg.content.substring('yui!'.length).split(' ').filter(element => element);
  if(commandList.indexOf(command[0]) === -1) return;
  
  switch(command[0]) {
    case 'kostka':
      randomNumber = genRandom(7);
      if(randomNumber == 0) randomNumber += 1; 
      msg.channel.send(createGifEmbed('Witaj ' + memberN, null).addField('Rzuciłeś kostką!', 'Wyrzuciłeś `' + randomNumber + '`'));
      break;
    case 'ping':
      msg.channel.send("Pong! Poczekaj chwilkę...").then((mess) => {mess.edit("Mój ping to: " + (Date.now() - msg.createdTimestamp))});
      break;
    case 'ship':
      if(command[1] === undefined || command[2] === undefined) {
        msg.channel.send(AirShip);
        return;
      }
      randomNumber = (process.env.SECRET.length * command[1].length * command[2].length) % 100;
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
        var responseText = JSON.parse(this.responseText).result.fulfillment.speech;
        msg.channel.send(new Discord.RichEmbed().addField(`Odpowiedź dla ${memberN} :`, responseText).setColor('RANDOM'))
      }
      request.send();
      break;
    case 'addme':
      msg.channel.send('https://discordapp.com/api/oauth2/authorize?client_id=551414888199618561&scope=bot&permissions=8')
      break;
    case 'verify':
      msg.channel.send('Sorki ale nad tym pracuję!')
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
    text = textArray.join(' ')
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
    //.addField('Wojownicy RP (Koty), prefix - `yui!wojownik`', '`poluj`')
    //.addField('Komendy związane z SAO, prefix - `yui!sao`', '`sandwich`, `eat`, `run`')
    .addField('Administracyjne : prefix - `yui!admin`', '`welcome`, `autorole`')
    .addField('Output komendy :', '`[argument]` - nie wymagany, `<argument>` - wymagany');
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
  var guildID = msg.channel.guild.id;
  switch(command[0]) {
    case 'welcome':
      if(command[2] == null || command[2] == undefined) {
        msg.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle('Aktualizacja ustawień')
                         .addField('Kanał do wysyłania wiadomości :', 'Przywrócono domyślne').addField('Wiadomość :', 'Przywrocono domyślne'));
        Guilds.update({ "welcomeEnabled": false, "welcomeChannel": null, "welcomeMessage": null}, { where: { guildId: guildID }})
        return;
      }
      var channel = msg.mentions.channels.first().id, messageArray = command.slice(2), message = '';
      message = messageArray.join(' ')
      msg.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle('Aktualizacja ustawień')
                         .addField('Kanał do wysyłania wiadomości :', `<#${channel}>`).addField('Wiadomość :', message));
      message = encodeURI(message);
      Guilds.update({ "welcomeEnabled": true, "welcomeChannel": channel, "welcomeMessage": message}, {where: { guildId: guildID } });
      break;
    case 'autorole':
      var role = msg.mentions.roles.first();
      if(role == null || role == undefined) {
        Guilds.update({ "autoroleEnabled": false, "autoroleId": null}, {where: { guildId: guildID }})
        msg.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle('Aktualizacja ustawień')
                         .addField('Rola do automatycznego dawania :', 'Przywrócono domyślne'));
        return;
      }
      Guilds.update({ "autoroleEnabled": true, "autoroleId": role.id}, {where: {guildId: guildID }})
      msg.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle('Aktualizacja ustawień').addField('Rola do automatycznego dawania :', `<@&${role}>`));
      break;
    case 'verify':
      var role = msg.mentions.roles.first();
      if(role == null || role == undefined) {
        Guilds.update({ "verifyEnabled": false, "verifyRoleId": role}, {where: { guildId: guildID }})
        msg.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle('Aktualizacja ustawień')
                         .addField('Rola dawana po przejściu weryfikacji :', 'Przywrócono domyślne'));
        return;
      }
      Guilds.update({ "verifyEnabled": true, "verifyRoleId": role.id}, {where: {guildId: guildID }})
      msg.channel.send(new Discord.RichEmbed().setColor('RANDOM').setTitle('Aktualizacja ustawień').addField('Rola dawana po przejściu weryfikacji :', `<@&${role}>`));
      break;
  }
  Guilds.sync();
})
//Reakcje, gify i słodkie rzeczy.

client.on('message', msg => {
  if(!(msg.content.startsWith('yui!'))) return;
  var command = msg.content.substring('yui!'.length).split(' ').filter(element => element);
  if(commandList.indexOf(command[0]) === -1) return;
    
  //Variables
  var everyone = false, self = false, memberMentionedName;
  var memberUser = msg.member.nickname;
  if(memberUser === null) memberUser = msg.author.username;
  let mention = AllOrOneOrAlone(msg.mentions);
    
  if(mention.everyone) everyone = true;
  if(mention.member) {
    if(msg.author.id == msg.mentions.members.first().id) {
      msg.channel.send(MentionSelf)
      return;
    }
    memberMentionedName = msg.mentions.members.first().nickname;
    if(memberMentionedName == null) memberMentionedName = msg.mentions.members.first().user.username;
  }
  if(mention.self) self = true;
    
  switch(command[0]) {
  case 'giphy':
    if(!self) msg.channel.send(commands.command.giphy.notSelf);
    else https.get(`https://api.giphy.com/v1/gifs/random?tag=${command[1]}&api_key=${process.env.GiphyApiKey}`, response => {
          let responseText = '';
          response.on('data', chunk => { if (chunk) responseText += chunk; })
          response.on('end', () => { msg.channel.send(createGifEmbed(`O to gif dla ciebie, ${memberUser}`, JSON.parse(responseText).data.images.original.url)); })
         })
    break;
  case 'ban':
    if(!(mention.member)) msg.channel.send(commands.command.notOther('ban'));
    else msg.channel.send(createGifEmbed(`${memberUser} : Zbanujmy ${memberMentionedName}!`, gif_ban[genRandom(gif_ban.length)]));
    break;
  case 'kiss':
    if(!(mention.member)) msg.channel.send(commands.command.notOther('kiss'));
    else msg.channel.send(createGifEmbed(`${memberMentionedName} został pocałowany przez ${memberUser}`, gif_kiss[genRandom(gif_kiss.length)]));
    break;
  case 'hug':
    if(!(mention.member)) msg.channel.send(commands.command.notOther('hug'));
    else msg.channel.send(createGifEmbed(`${memberMentionedName} został przytulony przez ${memberUser}`, gif_hug[genRandom(gif_hug.length)]));
    break;
  case 'slap':
    if(!(mention.member)) msg.channel.send(commands.command.notOther('slap'));
    else msg.channel.send(createGifEmbed(`${memberMentionedName} został uderzony przez ${memberUser}`, gif_slap[genRandom(gif_slap.length)]));
    break;
  case 'cry':
    if (everyone) msg.channel.send(commands.command.cry.notEveryone);
    else {
      if(self) msg.channel.send(createGifEmbed(`${memberUser} płacze`, gif_cry[genRandom(gif_cry.length)]));
      else msg.channel.send(createGifEmbed(`${memberUser} płacze przez ${memberMentionedName}`, gif_cry[genRandom(gif_cry.length)]));
    }
    break;
  case 'cheer': 
    if(!(mention.member)) msg.channel.send(commands.command.notOther('cheer')); 
    else msg.channel.send(createGifEmbed(`${memberUser} pociesza ${memberMentionedName}!`, gif_cheer[genRandom(gif_cheer.length)]));
    break;
  case 'pat':
    if(!(mention.member)) msg.channel.send(commands.command.notOther('pat'));
    else msg.channel.send(createGifEmbed(`${memberUser} glaszcze ${memberMentionedName}`, gif_pat[genRandom(gif_pat.length)]));
    break;
  case 'kill':
    if(everyone) msg.channel.send(commands.command.kill.notEveryone);
      else {
      if(self) msg.channel.send(createGifEmbedWithColor(`${memberUser} popełnia samobójstwo...`, 'RED', gif_kill_self[genRandom(gif_kill_self.length)]));
      else msg.channel.send(createGifEmbedWithColor(`${memberUser} zabija ${memberMentionedName}...`, 'RED', gif_kill_other[genRandom(gif_kill_other.length)]));
    }
    break;
  case 'angry':
    if(!(mention.member)) msg.channel.send(commands.command.notOther('angry'));
    else msg.channel.send(createGifEmbed(`${memberUser} jest zly na ${memberMentionedName}`, gif_angry[genRandom(gif_angry.length)]));
    break;
  case 'smile':
    if(!(mention.member)) msg.channel.send(commands.command.notOther('smile'));
    else msg.channel.send(createGifEmbed(`${memberUser} uśmiechnął się do ${memberMentionedName}`, gif_smile[genRandom(gif_smile.length)]));
    break;
  case 'nani':
    if(!(mention.member)) msg.channel.send(commands.command.notOther('nani'));
    else msg.channel.send(createGifEmbed(`${memberMentionedName} COOOO?`, gif_nani[genRandom(gif_nani.length)]));
    break;
  case 'cookie':
    if(self) msg.channel.send(commands.command.cookie.notSelf);
    else {
      if (everyone) msg.channel.send(createGifEmbed('Ciasteczka dla wszystkich!', gif_cookie[genRandom(gif_cookie.length)]));
      else msg.channel.send(createGifEmbed("", null).addField(`${memberMentionedName} dostal ciasteczko od ${memberUser}`, 'UwU (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ :cookie:'));
    }
    break;
  case 'cat':
    if(!self) msg.channel.send(commands.command.cat.notSelf);
    else {
      let headers = {
        hostname: "api.thecatapi.com",
        path: "/v1/images/search?order=RANDOM&limit=1",
        headers: { 'x-api-key': process.env.CatApiKey }
      }
      https.get(headers, response => {
        let responseText = '';
        response.on('data', chunk => { if (chunk) responseText += chunk; })
        response.on('end', () => { msg.channel.send(createGifEmbed(`O to koteczek dla ciebie, ${memberUser}`, JSON.parse(responseText)[0].url)); })
      })
    }
    break;
}
   
  
});

client.on('message', msg => {
  if(!(msg.content.startsWith('Ok Yui,'))) return;
  var data = new Date(), hours = data.getHours() + 2, minutes = data.getMinutes();
  if(hours > 23) hours -= 24;
  if(minutes < 10) minutes = '0' + minutes;
  let text = msg.content.substring('Ok Yui, '.length);
  if(text == 'która godzina?') {
    msg.channel.send(`Jest godzina ${hours}:${minutes}`)
    return;
  }
})

client.on('message', msg => {
  if(msg.content.toLowerCase().includes('Kirito x Klein'.toLowerCase())) {
    msg.channel.send('yui!cry');
    msg.delete(0);
  }
})

function createGifEmbed(title, gif) { return new Discord.RichEmbed().setTitle(title).setColor('RANDOM').setImage(gif); }
function createGifEmbedWithColor(title, color, gif) { return new Discord.RichEmbed().setTitle(title).setColor(color).setImage(gif); }  
client.login(process.env.SECRET);

function genRandom(num) { return Math.floor(Math.random() * num); }
function AllOrOneOrAlone(mentions) {
  return {
    "everyone": mentions.everyone,
    "member": mentions.members.first() != undefined,
    "self": !(mentions.members.first() != undefined || mentions.everyone)
  }
}