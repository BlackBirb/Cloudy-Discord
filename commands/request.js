const { songExist, request } = require("../utils/requestSong.js");
const { MessageEmbed } = require("discord.js");
const reactions = ["nope","1⃣","2⃣","3⃣","4⃣","5⃣","6⃣","7⃣"];
const limitsDB = new Map()
const limits = [2, 900000]

function upLimitFor(id) {
    let now = Date.now()

    if(!limitsDB.has(id) || limitsDB.get(id).timestamp < now)
        return limitsDB.set(id, {amount: 1, timestamp: now + limits[1]})

    limitsDB.get(id).amount++
}

function checkLimit(id) {
    let timestamp = Date.now()
    if(limitsDB.has(id)) {
        let user = limitsDB.get(id)
        if(user.amount >= limits[0] && user.timestamp > timestamp) {
            return false
        }
    }
    return true

}

async function addReactions(amount, msg, cancel = true) {
    try {
        for(let i = 1;i<=amount;i++) {
            await msg.react(reactions[i])
        }
        await msg.react(msg.client.static.nopeEmoji)
    } catch(e) {
        return null;
    }
}

module.exports = {
    help: {
        help: "Zamawia piosenkę! Napisz `cd!request nazwa piosenki` a bot wyśle ci 5 piosenek z naszej bazy które najbardziej pasują do wpisanej frazy! Reakcjami wybierz numer piosenki i gotowe!\nNa zamawianie piosenek jest ustawiony limit, każdą piosenke można zamówić raz na 30 min. Aby zobaczyć ile pisenek możesz zamówić użyj `cd!request limits`",
        usage: "<nazwa piosenki>"
    },
    process: async (msg, args) => {
        if(args[0] && ["limity", "limits", "limit"].includes(args[0].toLowerCase())) return msg.reply(`Możesz zamówić ${limits[0]} piosenek na ${limits[1] / 60 /1000} minut`)

        const userTitle = args.join(" ")
        try {
            const response = await songExist(userTitle.replace(/\s+/g, "%20"))
            
            if(!response.exists) return msg.reply("Nie moge znaleść takiej piosenki")
            const results = response.titles

            const embed = new MessageEmbed()
                .setColor(0x02ba6f)
                .setTitle("Którą z tych piosenek chciałeś puścić?")
                .setDescription("Kliknij na reakcje aby wybrać piosenke, masz 30s!")

            results.forEach((result, i) => {
                embed.addField(`#${i+1}`,result)
            })

            const message = await msg.channel.send({ embed })

            addReactions(results.length, message)

            const collected = await message.awaitReactions((reaction, user) => user.id === msg.author.id && reactions.includes(reaction.emoji.name), {max: 1, time: 30000})

            if(collected.size < 1) {
                message.delete()
                return msg.reply("Anulowano!")
            }
            const picked = reactions.indexOf(collected.first().emoji.name)

            if(picked === 0) {
                message.delete()
                return msg.reply("Anulowano!")
            }
            message.delete()
            let title = results[picked-1]
            
            if(!checkLimit(msg.author.id)) return msg.reply(`Zbyt szybko zamawiasz piosenki! Możesz zamówić ${limits[0]} piosenek na ${limits[1] / 60 /1000} minut`)

            const res = await request(title)
            console.log(res)

            upLimitFor(msg.author.id)
            return msg.channel.send(`Piosenka **${res.data}** zamówiona!`)
        } catch(res) {
            console.log(res)
            if(res.code === 'ECONNRESET')
                return msg.reply("Nie możesz używać znaków specjalnych")
            if(res.code === 'ECONNREFUSED')
                return msg.reply("Sorry! Server is ofline now!")
            if(res.status === 404) 
                return msg.channel.send("Taka piosenka nie istnieje!")
            else if(res.status === 429 && typeof res.body.tryagain !== "undefined") {
                const time = Math.floor(res.body.tryagain/1000)
                const min = Math.floor(time/60)
                return msg.channel.send(`Ta piosenka była zamówiona chwile temu! Spróbuj za ${min > 0 ? min+"m " : " "}${time % 60}s`)
            }
            else if(res.status === 429) 
                return msg.channel.send("Ta piosenka właśnie gra!")

            return msg.reply(`Ouch! an error: \`${res}\``)
        }
    },
    group: "radio",
    expectsSuffix: true,
    noSuffix: "Ta komenda wymaga parametrów!\n`cd!request <nazwa piosenki>`"
}