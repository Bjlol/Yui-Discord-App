module.exports = {
    name: "owner_spam",
    execute: (msg, number, text) => { for (let i = 0; i < number; i++) { msg.channel.send(text); }}
}