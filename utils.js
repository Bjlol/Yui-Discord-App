const Discord = require('discord.js');

module.exports = {
    genRandom: (min, max) => { return Math.floor(Math.random() * (+max - +min)) + +min; },
    createGifEmbed: (title, gif) => { return new Discord.RichEmbed().setTitle(title).setColor('RANDOM').setImage(gif); },
    createGifEmbedWithColor: (title, gif, color) => { return new Discord.RichEmbed().setTitle(title).setColor(color).setImage(gif); },
    isOwner: (id) => {return id == 344048874656366592}
    
}