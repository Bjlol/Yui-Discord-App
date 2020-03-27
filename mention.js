module.exports = (msg) => {
    let mentions = msg.mentions;
    return {
        "everyone": mentions.everyone,
        "member": mentions.members.first() != undefined,
        "self": !(mentions.members.first() != undefined || mentions.everyone)
    }
}