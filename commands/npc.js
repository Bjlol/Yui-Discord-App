module.exports = {
    name: "npc",
    execute: (msg) => {
        var msgContent = msg.content.substring('yui!npc '.length);
        var args = msgContent.split(' '), number = parseInt(args[0]),
            whoText = args.slice(1, number + 1).join(" "),
            text = args.slice(1 + number).join(" ");
        msg.channel.send(new Discord.RichEmbed()
            .addField('NPC :', `\`\`\`${whoText}\`\`\``)
            .addField('Czynnoœæ :', `\`\`\`${text}\`\`\``)
            .setColor('RANDOM'));
    }
}