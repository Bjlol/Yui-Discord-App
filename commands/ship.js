let errors = require('./../errors.js')

module.exports = {
    name: "ship",
    execute: (msg, args) => {
        if (args[1] === undefined || args[2] === undefined) {
            msg.channel.send(errors.AirShip);
            return;
        }
        let randomNumber = (process.env.SECRET.length * command[1].length * command[2].length) % 100;
        if (command[1] == 'Kirito' && command[2] == 'Asuna' || command[2] == 'Kirito' && command[1] == 'Asuna') randomNumber = 100;
        if (randomNumber >= 0 && randomNumber < 20) answer = ships[0];
        if (randomNumber >= 20 && randomNumber < 40) answer = ships[1];
        if (randomNumber >= 40 && randomNumber < 60) answer = ships[2];
        if (randomNumber >= 60 && randomNumber < 80) answer = ships[3];
        if (randomNumber >= 80 && randomNumber < 100) answer = ships[4];
        if (randomNumber == 100) answer = ':heart: Te¿ tak uwa¿am :heart:';

        msg.channel.send(`:heart: Sprawdzam :heart: \n - ${command[1]} \n - ${command[2]} \n${randomNumber}% - ${answer}`);}
}