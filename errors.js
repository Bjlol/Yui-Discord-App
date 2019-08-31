const Discord = require('discord.js');

module.exports = {
    AirShip: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Mam shipować to coś z powietrzem?!'),
    KillMe: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Chcesz mnie zabić?!?! \nCoś nie tak zobacz składnie komendy czy coś, Shift happens'),
    MentionSelf: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Sczegóły :', 'Nie możesz oznaczyć samego siebie!'),
    CantDelete: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Sorki! Ale nie mogę tutaj usuwać wiadomości...'),
    NoPerms: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Sorki! Ale nie masz uprawnień do tego!'),
    WrongLang: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Zły język!'),
    NumberBelowZero: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'No sorka ale akceptuje tylko dodatnie!'),
    RPDisabled: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Ta komenda jest zablokowana! Odblokuj paczkę RP, korzystając z komendy `yui!settings enable rp` (Tylko dla Administracji)'),
    CantFind: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Sorka! Nie mogę tego znaleźć'),
    CantFindChannel: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Sorka! Nie mogę znaleźć tego kanału... \nMoże został usunięty? Zapytaj Admina'),
    WrongField: new Discord.RichEmbed().setColor('RED').setTitle('Błąd').addField('Szczegóły :', 'Sorka! Nie mogę znależć takiego pola'),
};