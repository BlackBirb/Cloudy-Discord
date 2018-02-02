const fetch = require("snekfetch")
const config = require("../config.json")

const getListeners = async () =>{
    return fetch.get(config.iceURI+"status-json.xsl")
        .then(res => {
            if (!res.ok) return null
            return JSON.parse(res.text)
        }).then(data => {
            if(data === null) return null
            let source = data.icestats.source
            let listeners;
            if (typeof source === "object" && Array.isArray(source)) 
                if(source[0].hasOwnProperty("listeners") && source[0].listeners > 0) 
                    listeners = source[0].listeners
                else 
                    listeners = source[1].listeners
            else if(typeof source === "object" && source.hasOwnProperty("listeners"))
                listeners = source.listeners
            else return null
            return listeners
        })
}

module.exports = {
    help: {
        help: "Pokazuje ile osób słucha radia",
        usage: ""
    },
    process: async msg => {
        try {
            let listeners = await getListeners()
            if(listeners === null) return msg.channel.send("Nie udało sie uzyskać ilości słuchaczy, server jest prawdopodobnie offline")
            if(msg.client.radio.playing) listeners += msg.client.radio.channel.members.size - 1
            if(listeners < 1) return msg.channel.send("Nikt nas nie słucha! :C")
            return msg.channel.send(`Aktualnie słucha${listeners < 5 && listeners > 1 ? "ją" : ""} nas ${listeners} ${listeners === 1 ? "osoba" : listeners < 5 ? "osoby" : "osób"}`)
        } catch(err) {
            return msg.reply(`Ouch! an error: \`${err}\``)
        }
    },
    group: "radio",
    expectsSuffix: false
}


