const express = require('express'), app = express();
const yandex = require('yandex-translate')(process.env.YandexApiKey),
    uuidV5 = require('uuid/v5'), fs = require('fs'), https = require('https');
const data = require('./data'), GuildBase = require('./guilds.js')[0], Errors = require('./errors.js'),
      database = require('./database.js'), guildsDefaults = require('./guilds.js')[1], commands = require('./commands.js');

//Login to database then defining table
database.authenticate().catch(err => console.error('Unable to connect to the database:', err));
const Guilds = database.define('Guilds', GuildBase);

//Page requests
app.get("/", (_request, response) => { response.send('Yui is up and running in the 90\'s'); });
setInterval(() => https.get(`https://${process.env.PROJECT_DOMAIN}.glitch.me/`), 250000);
app.listen(process.env.PORT);

var commandList = data.commands;

//Gif & anwsers base
var gif_hug = data.hug, gif_kiss = data.kiss, gif_slap = data.slap,
    gif_cry = data.cry, gif_pat = data.pat, gif_cheer = data.cheer,
    gif_kill_self = data.kill_self, gif_kill_other = data.kill_other, gif_angry = data.angry,
    gif_smile = data.smile, gif_nani = data.nani, gif_ban = data.ban,
    gif_cookie = data.cookie, ships = data.ship;

//Discord Bot
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

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
      case 'dice':
          client.commands.get('dice').execute(msg, Discord);
          break;
      case 'ping':
          client.commands.get('ping').execute(msg);
          break;
      case 'ship':
          client.commands.get('ship').execute(msg, [command[0], command[1]]);
          break;
      case 'lenny':
          client.commands.get('lenny').execute(msg);
          break;
      case 'servers':
          client.commands.get('servers').execute(msg, Discord);
          break;
      case 'npc':
          client.commands.get('npc').execute(msg);
          break;
      case 'place':
          client.commands.get('place').execute(msg);
          break;
      case 'tabelka':
          var value = parseInt(command[1]);
          client.commands.get('tabelka').execute(msg, value);
          break;
      case 'translate':
          var lang = command[1], text = command.slice(2).join(" ");
          client.commands.get('translate').execute(msg, [lang, text], yandex);
          break;
      case 'assistant':
          client.commands.get('assistant').execute(msg, Discord, https)
          break;
      case 'addme':
          client.commands.get('addme').execute(msg);
          break;
      case 'verify':
          client.commands.get('verify').execute(msg);
          break;
  }
  
if(msg.author.id == '344048874656366592') {
  var YuiGuildMember = msg.guild.members.find(member => member.id === '551414888199618561')
  if (msg.content.startsWith('yui!command')) client.commands.get('owner_command').execute(msg, YuiGuildMember);

  if(msg.content.startsWith('yui!spam')) {
      var num = command[1], textArray = command.slice(2);
      client.commands.get('owner_spam').execute(msg, num, textArray.join(' '))
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