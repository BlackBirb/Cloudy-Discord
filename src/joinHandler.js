const passStrings = ["akceptuje regulamin","akceptuję regulamin","akceptuje"]
const kickStrings = ["nie akceptuje regulaminu", "nie akceptuję regulaminu", "nie akceptuje", "nie akceptuję", "nie", "naprawcie regulamin"]

function sleep(time) {
    return new Promise((res, rej) => {
        setTimeout(() => res(true), time)
    })
}

function clear(member, channel) {
    let messages = channel.messages.filter(m => m.author.id === member.user.id).array()
    messages.push(botMessages.get(member.id))
    if(messages.length < 2) {
        return messages.forEach(m => m.delete())
    }
    if(messages.length > 100) messages = 99
    channel.bulkDelete(messages)
}
let botMessages = new Map();

module.exports = async (client, member) => {
    const config = client.config
    if(member.user.bot) 
    return member.roles.add(config.roles.ekipa);

    let channel = client.static.acceptChannel
    await member.roles.add(config.roles.new)
    await sleep(1000)

    const embed = {
        "title": "Witamy na discordowym serwerze **CloudsdaleFM**!",
        "description": "Aktualnie nie masz dostępu do żadnego kanału, ale to sie zmieni.",
        "color": 42962,
        "timestamp": new Date(),
        "footer": {
            "icon_url": "https://discordapp.com/assets/dcbf6274f0ce0f393d064a72db2c8913.svg",
            "text": "Powodzenia!"
        },
        "thumbnail": {
            "url": "https://i.imgur.com/8HpLCz0.png"
        },
        "author": {
            "name": `Hej ${member.displayName}`,
            "url": "https://discordapp.com",
            "icon_url": member.user.avatarURL()
        },
        "fields": [
            {
                "name": "Dlaczego? 🤔",
                "value": `Zanim pozwolimy ci niszczyć serwer musisz przeczytać ${client.static.regulaminChannel ? client.static.regulaminChannel : "#regulamin"}`
            },
            {
                "name": "<:thonkang:371329969500192768>",
                "value": "Udało ci sie? Świetnie, teraz napisz **`Akceptuje regulamin`** na tym kanale potwierdzając przy tym, że sie z nim zgadzasz i będziesz go przestrzegał! Jestem botem więc musisz dokładnie napisać **`Akceptuje regulamin`** *Masz na to 20 min.*"
            }
        ]
    };
    let message = await channel.send(member.user.toString(), { embed });

    botMessages.set(member.id, message)

    channel.awaitMessages(m => ( m.author.id === member.id 
            && (passStrings.includes(m.content.toLowerCase())) 
            || kickStrings.includes(m.content.toLowerCase()) 
        ), 
        {max: 1, time: config.kickAfter *  1000}
    ).then(c => {
        if(c.size < 1) 
            member.kick("Did not accept rules")
        else {
            if(kickStrings.includes(c.first().content.toLowerCase())) {
                member.kick("Wyrażanie własnej opinii")
            }
            else {
                member.roles.remove(config.roles.new)
                member.roles.add(config.roles.user)
            }
        }
        clear(member, channel)
    }).catch(c => {
        member.kick("Did not accept rules")
        clear(member, channel)
    })
}