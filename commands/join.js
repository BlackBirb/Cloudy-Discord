module.exports = {
    help: {
        help: "Dołącza do kanału głosowego i puszcza radio!",
        usage: ""
    },
    process: async msg => {
        try {
            const { client } = msg
            if(!msg.member.voiceChannel) return msg.reply("Musisz być na kanale głosowym!")
            const channel = msg.member.voiceChannel
            const connection = await channel.join()
            if(client.radio.playing) {
                client.radio.channel = channel, 
                client.radio.connection = connection
                client.radio.playing = true 
                return msg.reply("Kanał zmienony!")
            }
            const dispatcher = connection.playArbitraryInput(client.config.listenURI)
            client.radio = { channel, connection, dispatcher, cooldown: false, playing: true }
            return msg.reply("Dołączyłem do kanału i puszczam radio! Aby przestać użyj komendy cd!leave")
        } catch(err) {
            console.log("Err at joining channel and playing radio")
            console.error(err)
            return msg.reply(`Whoops! Coś poszło nie tak, napisz do @${msg.client.config.author}`)
        }
    },
    group: "radio",
    expectsSuffix: false
}