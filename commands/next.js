const get = require("../utils/callAPI.js").get

module.exports = {
    help: {
        help: "Pokazuje następną piosenke która poleci w radiu",
        usage: ""
    },
    process: async msg => {
        try {
            const { track } = await get("data/next")
            return msg.channel.send(`Następna piosenka w kolejce: **${track}**`)
        } catch(err) {
            if(err.code === 'ECONNREFUSED')
                return msg.reply("Sorry! Server is ofline now!")
            return msg.reply(`Ouch! an error: \`${err}\``)
        }
    },
    group: "radio",
    expectsSuffix: false
}