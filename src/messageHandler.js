function now() {
    return `<${new Date().toLocaleString()}>`
}

module.exports = async (client, msg) => {
    if(msg.author.bot) return;
    if(msg.channel.id === client.static.acceptChannel.id) {
        if(msg.content.toLowerCase() !== "akceptuje regulamin") msg.react(client.static.nopeEmoji)
        return;
    } // check if you should react
    const config = client.config

    let content = msg.content
    if(!content.toLowerCase().startsWith(config.prefix)) return; //no prefix
    content = content.slice(config.prefix.length) // remove prefix
    let args = content.split(/\s+/g).filter(e => e.length > 0) // create args
    let cmd = args.shift().toLowerCase() // get command name
    if(!client.commands.has(cmd)) { // check if command exists
        msg.react(client.static.nopeEmoji)
        return console.log(now(), `Command '${cmd}' not found`); //command not found
    }
    let command = client.commands.get(cmd) // get Command object
    console.log(now(), `Command '${cmd}' was used by ${msg.author.tag} @ ${msg.author.id}`)
    
    if(command.expectsSuffix && !args.length) return msg.channel.send(command.noSuffix+ "\nTa oraz twoja wiadomość zostanie usunięta za 30s") .then(m => { // no parameters
        setTimeout(() => {
            m.delete()
            msg.delete()
        }, 30000)
    })

    try {
        msg.channel.startTyping()
        await command.process(msg, args) // command process should return a promise
        msg.channel.stopTyping(true)
    }
    catch(err) {
        console.error(err)
    }
}