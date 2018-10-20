module.exports = {
    help: {
        help: "Zaczyna nagrywanie radia.",
        usage: "start / stop"
    },
    process: async (msg, args) => {
        const recorder = msg.client.streamRecorder

        if(msg.client.static.ekipaRole.comparePositionTo(msg.member.roles.highest) > 0) return msg.reply("Nie masz wystarczających uprawnień!")
        recorder.channel = msg.channel

        if(args[0].toLowerCase() === "start") {
            if(!recorder.start()) return msg.reply("Nagrywanie jest już włączone.")
            return msg.reply(`Nagrywanie rozpoczęte w ${recorder.name}`)

        } else if(args[0].toLowerCase() === "stop") {
            if(!recorder.stop()) return msg.reply("Nic nie nagrywam!")
            return msg.reply(`Nagrywanie zakończone, plik to: ${recorder.name}`)
        }
        return msg.reply(`Suffix musi być "start" albo "stop"`)

    },
    group: "radio",
    expectsSuffix: true,
    noSuffix: "Ta komenda wymaga parametrów!\n`cd!recording start / stop`"
}