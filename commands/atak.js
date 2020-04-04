let errors = require('./../errors.js'), utils = require('./../utils.js'), commands = require('./../commands.js'),
  StringReader = require('./../stringReader.js');
module.exports = {
  name: "atak",
  execute: (Yui, msg) => {
    let attacks = Yui.userAttack;
    let interpenter = new StringReader(msg.content.substring('yui!atak'.length)), sub = [];
    sub[0] = interpenter.readWord();
    if (sub[0] === 'help') {
      let embed = new Yui.Discord.RichEmbed().setTitle(`Witaj ${utils.getAuthorName(msg)}`).addField('Użycie komendy:', `\`yui!atak <poziom> [klasa] [modyfikator] ${msg.guild.id == '563699676952526868' ? '[oznaczenie]' : ''}\``)
        .addField('Opis', `Sprawdzam czy twój atak się udał i ile zadał obrażeń. Klasy: 
                                    - normal - Normalny atak\n -ss - Sword skill (technika miecza)
                                    - mystic - Umiejętność mistyczna \n- ult - Super umiejętność` );
      if (msg.guild.id === '563699676952526868') embed.addField('Dodatkowe oznaczenia:', '`W` - Zwiększony próg obrażeń\n`Ł` - zwiększa szanse na udany atak\n`M` - Zwiększa szanse na udane skille');
      msg.channel.send(embed);
      return;
    }
    sub[1] = interpenter.readWord();
    sub[2] = interpenter.readInt();
    if (msg.guild.id === '563699676952526868') sub[3] = interpenter.readWord();
    var userComeout = attacks.get(msg.author.id) || { plus: 0, minus: 0 };
    var state = getStats(userComeout.plus, userComeout.minus);
    var lvl = parseInt(sub[0]) - 1;
    if (lvl < 0 && !lvl) {
      msg.channel.send(errors.KillMe).then(msge => { msge.delete(5000); msg.delete(5000) });
      return;
    }
    var okay = 0;
    if (state.first) okay = utils.genRandom(1, 20) + sub[2];
    if (state.second) okay = utils.genRandom(20, 40) + sub[2];
    if (state.third) okay = utils.genRandom(1, 40) + sub[2] + getBase(sub[1]);
    var dmg = calcDmg(lvl);
    if (msg.guild.id == '563699676952526868') {
      if (userComeout.plus / userComeout.minus <= 60 + lvl * 0.5) utils.genRandom(20, 40) + sub[2];
      else utils.genRandom(1, 20) + sub[2];
      switch (sub[3]) {
        case 'W':
          dmg = calcDmg(lvl) + 5;
          break;
        case 'Ł':
          if (getBase(sub[1]) == 0) okay = Math.round(okay + okay * 0.1);
          break;
        case 'M':
          if (getBase(sub[1]) != 0) okay = Math.round(okay + okay * 0.15);
          break;
      }
    }
    if (okay >= 20) {
      msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`)
        .addField('Informacje:', getAnswer(sub[1], dmg, okay)).setColor('GREEN'));
      return { user: msg.author.id, outcome: true };
    } else {
      msg.channel.send(new Yui.Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`)
        .addField('Informacje:', `[${okay}] Niestety, atak się nie udał...`).setColor('RED'));
      return { user: msg.author.id, outcome: false };
    }
  }
}

function getBase(clas) {
  let base = 0;
  switch (clas) {
    case 'ss':
      base = 3;
      break;
    case 'mystic':
      base = 5;
      break;
    case 'ult':
      base = 10;
      break;
    default:
      base = 0;
      break;
  }
  return base;
}

function getAnswer(clas, dmg, random) {
  let answer = "podstawowego ataku";
  switch (clas) {
    case 'ss':
      answer = 'Sword Skilla';
      break;
    case 'mystic':
      answer = 'ataku mistycznego';
      break;
    case 'ult':
      answer = 'superumiejętności';
      break;
  }
  return `[${random}] Użyłeś ${answer} i zadałeś **${dmg}** punktów obrażeń`
}

function getStats(plus, minus) {
  return {
    first: plus > minus,
    second: minus > plus,
    third: plus == minus
  }
}

function calcDmg(lvl) {
  lvl = lvl == 0 ? 1 : lvl;
  return utils.genRandom(lvl * 10, lvl * 10 + 40);
}