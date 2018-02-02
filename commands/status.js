const get = require("../utils/callAPI.js").get
const { MessageEmbed }= require("discord.js")
const formatSeconds = sec => [ Math.floor(sec / 86400), Math.floor(sec / 3600) % 24, Math.floor(sec / 60) % 60, sec % 60]
        .map(v => v < 10 ? "0" + v : v)
		.filter((v,i) => v !== "00" || i > 1)
		.join(":")

module.exports = {
    help: {
        help: "Pokazuje status radia",
        usage: ""
    },
    process: async msg => {
        let status = new MessageEmbed()
            .setTitle("Status bota CloudFM")
            .setColor(0x02ba6f)
        try {
            const { data } = await get("data/status")
            status.setDescription(`**Uptime:** ${formatSeconds(Math.floor(data.clientUptime/1000))}!\n**Gramy od:** ${new Date(data.playingSince).toLocaleString()}\nŁącznie leciało **${data.songsPlayed}** piosenek!\n${data.status["Client connected"] && data.status["Stream playing"] && data.status["API"] ? "Wszystko działa w edgy!" : !data.status["Client connected"] ? "Bot nie może połączyć sie do radia." : "Bot nie gra muzyki."}`)
        } catch(err) {
            if(err.code === 'ECONNREFUSED') 
                status.setTitle("Bot od muzyki jest offline!")
                .setColor(0xdc2839)
            else 
                return msg.reply(`Ouch! an error: \`${err}\``)

        }
        return msg.channel.send({embed: status})
    },
    group: "radio",
    expectsSuffix: false
}