const presistentCollection = require("../utils/presistentCollection.js")
const get = require("../utils/callAPI.js").get
const likes = new presistentCollection({name: "likes", dataDir: "./dataBases"})

module.exports = {
    help: {
        help: "Daje like piosence która teraz gra w radiu! Każdy może dać like tylko raz każdej piosence!\nPierwsze 10 piosenek możesz znaleść pod komendą `cd!like top10`",
        usage: "?top"
    },
    process: async (msg, args) => {
        /**
         * args[0] - first argument given by user
         * likes - Discordjs.Collection of <songname, Array<usersID>>
         */
        if(args[0] && ["top", "list","all","top10","show"].includes(args[0].toLowerCase())) {
            const top = likes.sort((a,b) => b.length - a.length)
            const formated = new Array()
            let i = 0
            for(const [key, value] of top) {
                formated[i] = `#${i+1} - ${key} - ${value.length}`
                if(i++ === 9) break;
            }
            return msg.channel.send(`Top 10 piosenek pod względem likeów:\n${formated.join("\n")}`)
        }

        try {
            let body = await get("data/playing")
            let res = body.track
            if(!likes.has(res)) 
                likes.set(res, new Array())
            const val = likes.get(res)
            if(val.includes(msg.author.id))
                return msg.reply("Już dałeś tej piosence like!")
            val.push(msg.author.id)
            likes.set(res, val)
            return msg.reply(`Piosenka **${res}** dostała od ciebie like! Ma ich teraz **${val.length}**`)
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