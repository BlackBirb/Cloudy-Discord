const get = require("../utils/callAPI.js").get

module.exports = {
    help: {
        help: "Pokazuje piosenke która leci teraz w radiu",
        usage: ""
    },
    process: async msg => {
        try {
            const { track } = await get("data/now")
            msg.client.setPlaying(track)
            return msg.channel.send(`Aktualnie gramy piosenke: **${track}**`)
        } catch(err) {
            console.log(err)
            if(err.code === 'ECONNREFUSED')
                return msg.reply("Sorry! Server is ofline now!")
            return msg.reply(`Ouch! an error: \`${err}\``)
        }
    },
    group: "radio",
    expectsSuffix: false
}