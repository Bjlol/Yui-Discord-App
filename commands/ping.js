module.exports = {
    name: "ping",
    execute: (msg) => {
        msg.channel.send("Pong! Poczekaj chwilk�...")
        .then((mess) => { mess.edit("M�j ping to: " + (Date.now() - msg.createdTimestamp)) });
    }
}