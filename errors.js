const Discord = require('discord.js');

module.exports = {
    AirShip: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Mam shipować to coś z powietrzem?!'),
    KillMe: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Chcesz mnie zabić?!?!'),
    MentionSelf: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Sczegóły :', 'Nie możesz oznaczyć samego siebie!'),
    CantDelete: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Sorki! Ale nie mogę tutaj usuwać wiadomości...'),
    NoPerms: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Sorki! Ale nie masz uprawnień do tego!'),
    WrongLang: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Zły język!'),
};