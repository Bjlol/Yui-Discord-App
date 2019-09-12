let errors = require('./../errors.js'), utils = require('./../utils.js'), mentions = require('./../mention.js'),
  commands = require('./../commands.js'), StringReader = require('./../stringReader.js');
module.exports = {
  name: "atak",
  execute: (Yui, msg) => {
    let attacks = Yui.userAttack;
    let interpenter = new StringReader(msg.content.substring('yui!atak'.length)), sub = [];
    sub[0] = interpenter.readWord();
    if (sub[0] == 'help') {
      msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj ${utils.getAuthorName(msg)}`).addField('Użycie komendy:', `\`yui!atak <poziom> [klasa] [modyfikator]\``)
        .addField('Opis', `Sprawdzam czy twój atak się udał i ile zadał obrażeń. Klasy: 
                                    - normal - Normalny atak\n -ss - Sword skill (technika miecza)
                                    - mystic - Umiejętność mistyczna \n- ult - Super umiejętność` ))
      return;
    }
    sub[1] = interpenter.readWord();
    sub[2] = interpenter.readInt();
    var userComeout = attacks.get(msg.author.id) || { plus: 0, minus: 0 }
    var state = getStats(userComeout.plus, userComeout.minus);

    var lvl = ~sub[1] - 1;
    if (lvl < 0 && !lvl) {
      msg.channel.send(errors.KillMe).then(msge => { msge.delete(5000); msg.delete(5000) });
      return;
    }
    var okay = 0;
    if (state.first) okay = getRandomBelowZero() + sub[2];
    if (state.second) okay = getRandomAboveTwenty() + sub[2];
    if (state.third) okay = utils.genRandom(1, 40) + sub[2] + getBase(sub[1]);
    var dmg = calcDmg(lvl);
    if (okay >= 20) {
      msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`).addField('Informacje:', getAnswer(sub[2], dmg, okay)).setColor('GREEN'))
      return { user: msg.author.id, outcome: true }
    } else {
      msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj, ${utils.getAuthorName(msg)}`).addField('Informacje:', `[${okay}] Niestety, atak się nie udał...`).setColor('RED'))
      return { user: msg.author.id, outcome: false }
    }
  }
}

function getBase(clas) {
  let base = 0;
  switch (clas) {
    case 'normal':
      base = 0;
      break;
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
  switch (clas) {
    case 'normal':
      return `[${random}] Użyłeś podstawowego ataku i zadałeś **${dmg}** punktów obrażeń`
      break;
    case 'ss':
      return `[${random}] Użyłeś Sword skilla i zadałeś **${dmg}** punktów obrażeń`
      break;
    case 'mystic':
      return `[${random}] Użyłeś ataku mistycznego i zadałeś **${dmg}** punktów obrażeń`
      break;
    case 'ult':
      return `[${random}] Użyłeś superumiętności i zadałeś **${dmg}** punktów obrażeń`
      break;
    default:
      return `[${random}] Użyłeś podstawowego ataku i zadałeś **${dmg}** punktów obrażeń`
      break;
  }
}

function getStats(plus, minus) {
  return {
    first: plus > minus,
    second: minus > plus,
    third: plus == minus
  }
}

function getRandomBelowZero() { return utils.genRandom(1, 20); }

function getRandomAboveTwenty() { return utils.genRandom(20, 40); }

function calcDmg(lvl) {
  let num = utils.genRandom(1, lvl * 10 + 40)

  while (num < lvl * 10) num = utils.genRandom(1, lvl * 10 + 40)
  return num;
}