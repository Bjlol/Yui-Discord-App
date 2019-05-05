module.exports = {
    name: "dice",
    execute: (msg, discord) => {
        let min = 1, max = 6;
        let number = Math.floor(Math.random() * (+max - +min)) + +min;
        var memberN = msg.member.nickname;
        if (memberN === null) memberN = msg.author.username;
        msg.channel.send(new discord.RichEmbed().setTitle('Witaj ' + memberN).setColor('RANDOM').addField('Rzuci³eœ kostk¹!', `Wyrzuci³eœ ${number}`))
    }
}