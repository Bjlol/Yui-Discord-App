module.exports = {
    name: "place",
    execute: (msg) => {
        text = msg.content.substring('yui!place '.length);
        msg.channel.send(new Discord.RichEmbed().addField('Miejsce', `\`\`\`${msg.channel.name.replace('-', ' ')}\`\`\``)
            .setColor('RANDOM').addField('Co :', `\`\`\`${text}\`\`\``));
    }
}