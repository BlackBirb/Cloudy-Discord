const get = require("../utils/callAPI.js").get

module.exports = {
    help: {
        help: "Pokazuje kolejke piosenek które polecą w radiu",
        usage: ""
    },
    process: async msg => {
        try {
            let res = await get("data/queue")
            queue = res.queue.filter(v => v != null)
            if(queue.length < 1) return msg.channel.send("Nie ma kolejki?!? Sum Tin Brok")
            if(res.length === 0) return msg.channel.send(`Następna losowa piosenka: **${queue[0]}**`)
            let list = queue.map((e, i) => `#${i+1} - **${e}**`)
            if(list.length > 5) list = list.splice(0,5)
            return msg.channel.send(`Kolejka ma ${res.length+1} zamówionych piosenek\nNastępne ${list.length} piosenek:\n${list.join("\n")}`)
        } catch(err) {
            if(err.code === 'ECONNREFUSED')
                return msg.reply("Sorry! Server is ofline now!")
            return msg.reply(`Ouch! an error: \`${err}\``)
        }
    },
    group: "radio",
    expectsSuffix: false
}