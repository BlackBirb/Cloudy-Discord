module.exports = {
    help: {
        help: "Wysyła link do słuchania radia!",
        usage: ""
    },
    process: async msg => {
        return msg.channel.send({ embed: {
            color: 42962,
            description: `Radia możesz posłuchać na naszej [stronie internetowej](${msg.client.config.webURI})\nAlbo przez [bezpośredni link!](${msg.client.config.listenURI})\nMożesz także słuchać radia na discordzie używajac cd!join`
        }})
    },
    group: "radio",
    expectsSuffix: false
}