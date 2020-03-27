const utils = require('./../utils.js'), data = require('./../data.js'), commands = require('./../commands.js'),
  StringReader = require('./../stringReader.js'), errors = require('./../errors.js');

module.exports = {
  name: "time",
  execute: (Yui, msg) => {
    let interpenter = new StringReader(msg.content.substring('yui!time'.length)), sub = [], name = utils.getAuthorName(msg);
    sub[0] = interpenter.readWord();
    sub[1] = interpenter.readWord();
    if (sub[0] == 'help') {
      msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj, ${name}`).addField('Użycie:', 'yui!time <rola/użytkownik> <czas w dniach>')
        .addField('Opis', 'Pokazuje listę osób którzy są dłużej niż ilość dni! Ew. sprawdza to dla jednej osoby'))
      return;
    }
    if (msg.member.hasPermission('MANAGE_ROLES') || utils.isOwner(msg.author.id)) {
      var memberN = msg.member.nickname;
      if (memberN === null) memberN = msg.author.username;
      let days = parseInt(sub[1]);
      let mention = utils.mentions(msg), self, everyone, memberMentionedName, roles = msg.mentions.roles;

      if (mention.everyone) everyone = true;
      if (mention.member) {
        if (msg.author.id != msg.mentions.members.first().id) {
          memberMentionedName = msg.mentions.members.first().nickname;
          if (memberMentionedName == null) memberMentionedName = msg.mentions.members.first().user.username;
        }
      }
      if (mention.self) self = true;
      if (Array.from(roles.values()).length > 0) {
        let filter1 = msg.guild.members.filter(user => user.roles.find(role => role.id == Array.from(roles.values())[0].id))
        let filter2 = filter1.filter(user => getDaysFromDate(user.joinedAt) > days || getDaysFromDate(user.joinedAt) == days)

        let users = Array.from(filter2.values()).reduce((acc, cur) => {
          let name = cur.nickname || cur.user.username;
          let uDays = getDaysFromDate(cur.joinedAt);
          return acc + `- ${name} ${Math.abs(uDays - days) == 0 ? '' : '(' + (Math.abs(uDays - days)) + ')'}\n`;
        }, '')
        msg.channel.send(new Yui.Discord.RichEmbed().setTitle('Witaj, ' + memberN).addField('O to wyniki', users))
      } else {
        if (mention.member != undefined) {
          let userDays = getDaysFromDate(msg.mentions.members.first().joinedAt);
          let bool = userDays >= days ? `Tak ten użytkownik jest dłużej niż ${days} dni` : `Nie ten użytkownik nie jest dłużej niż ${days} dni, brakuje mu ${Math.abs(userDays - days)} dni`;
          msg.channel.send(new Yui.Discord.RichEmbed().setTitle('Witaj, ' + memberN).addField('Wynik', bool))
        } else {
          msg.channel.send('A kogo mam sprawdzać?')
        }
      }
    } else {
      msg.channel.send(errors.NoPerms)
    }
  }
}

function getDaysFromDate(date) {
  let today = new Date();
  return Math.round((today - date) / (1000 * 60 * 60 * 24));
}
