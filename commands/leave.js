module.exports = {
    help: {
        help: "Opuszcza kanał głosowy.",
        usage: ""
    },
    process: async msg => {
        try {
            const { client } = msg
            if(!client.radio.playing) return msg.reply("Nie ma mnie na żadnym kanale.")
            client.radio.dispatcher.end()
            client.radio.channel.leave()
            client.radio = { channel: null, connection: null, dispatcher: null, cooldown: false, playing: false }
            return msg.reply("Koniec muzyki!")
        } catch(err) {
            console.log("Err at leaving channel.")
            console.error(err)
            return msg.reply(`Whoops! Coś poszło nie tak, napisz do @${msg.client.config.author}`)
        }
    },
    group: "radio",
    expectsSuffix: false
}