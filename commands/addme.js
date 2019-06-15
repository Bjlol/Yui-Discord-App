module.exports = {
    name: "addme",
    execute: (msg) => {
        msg.channel.send('https://discordapp.com/api/oauth2/authorize?client_id=551414888199618561&scope=bot&permissions=8');
    }
}