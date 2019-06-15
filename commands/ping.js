module.exports = {
    name: "ping",
    execute: (msg) => {
        msg.channel.send("Pong! Poczekaj chwilkę...")
        .then((mess) => { mess.edit("Mój ping to: " + (Date.now() - msg.createdTimestamp)) });
    }
}