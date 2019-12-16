const errors = require('./../errors.js'), utils = require('./../utils.js'), Discord = require('discord.js')


module.exports = {
    name: "ranking",
    execute: (Yui, msg) => {
        let levels = Yui.levels;
        levels.findAll().then(results => {
            let resultsElt = results;
            resultsElt.sort((lelt, relt) => {
                if (relt.lvl - lelt.lvl != 0) return relt.lvl - lelt.lvl;
                else return relt.xp - lelt.xp;
            })
            var promiseArray = [];
            resultsElt.slice(0, 10).forEach(elt => { promiseArray.push(Yui.fetchUser(elt.userId)) });
            Promise.all(promiseArray).then(arra => {
                let arr = [];
                for (let j = 0; j < arra.length; j++) if (arra[j]) arr.push(arra[j]);
                let topTen = arr.reduce((sum, elt) => {
                    let userLvl = resultsElt.find(usrData => usrData.userId == elt.id).lvl;
                    return sum + `> ${elt.username}, ${userLvl} poziom\n`
                }, '')
                msg.channel.send(new Discord.RichEmbed().setTitle(`Witaj ${utils.getAuthorName(msg)}`).addField('Top 10 użytkowników', topTen))
            })
        })
    }
}