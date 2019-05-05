module.exports = {
    name: "ping",
    execute: (msg) => {
        msg.channel.send("Pong! Poczekaj chwilkê...")
        .then((mess) => { mess.edit("Mój ping to: " + (Date.now() - msg.createdTimestamp)) });
    }
}