const { MessageEmbed } = require("discord.js")

module.exports = {
    help: {
        help: "Bardzo pomocna pomoc",
        usage: ""
    },
    process: async (msg, args) => {
        if(args.length < 1) {
            let commands = Array.from(msg.client.commands.filter(c => c.group != "hidden").keys())
            const embed = new MessageEmbed()
                .setColor(0x02ba6f)
                .setTitle("CloudsdaleFM Discord bot")
                .setURL("https://cloudsdalefm.net/") 
                .setThumbnail(msg.client.user.avatarURL())
                .setDescription(`Pomoc do tego bota. dostępne komendy:\n \`${commands.join("` `")}\`\n\nAby zobaczyć pomoc do określonej komendy napisz \`cd!help komenda\``)
            return msg.channel.send({embed})
        }
        const [ cmd ] = args
        if(!msg.client.commands.has(cmd)) return msg.channel.send("Taka komenda nie istnieje!")
        let command = msg.client.commands.get(cmd);
        const embed = new MessageEmbed()
            .setColor(0x02ba6f)
            .setTitle(`Pomoc dla komendy ${cmd}`)
            .setDescription(command.help.help);
        return msg.channel.send({ embed })
    },
    group: "help",
    expectsSuffix: false
}