const get = require("../utils/callAPI.js").get

module.exports = {
    help: {
        help: "Pokazuje historie piosenek które leciały w radiu",
        usage: ""
    },
    process: async msg => {
        try {
            let res = await get("data/history")
            res = res.data.filter(v => v != null)
            if(res.length < 1) return msg.channel.send("Wygląda na to że dopiero zaczeliśmy grać!")
            if(res.length === 1) return msg.channel.send(`Ostatnia piosenka: **${res[0]}**`)
            let list = res.map((e, i) => `#${i+1} - **${e}**`).join("\n")
            return msg.channel.send(`Ostatnie ${res.length} piosenek:\n${list}`)
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