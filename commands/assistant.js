module.exports = {
    name: "assistant",
    execute: (msg, Discord, https) => {
        text = msg.content.substring('yui!assistant '.length), sessionId = uuidV5(msg.author.avatarURL, uuidV5.URL);
        https.get(`${process.env.DialogFlow}/demoQuery?q=${text}&sessionId=${sessionId}`, response => {
            let responseText = '';
            response.on('data', chunk => { if (chunk) responseText += chunk; })
            response.on('end', () => {
                msg.channel.send(new Discord.RichEmbed()
                    .addField(`Odpowiedü dla ${memberN} :`, JSON.parse(responseText).result.fulfillment.speech).setColor('RANDOM'))
            })
        })
    }
}