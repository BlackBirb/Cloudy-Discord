const Discord = require('discord.js');

function cancel (info, menu) {
  menu.delete()
  info.delete()
  msg.channel.send("Tworzenie głosowania anulowane!")
  return null
}

async function getOption (id, msg, question, menuMessage) {
  if(question) {
    msg.edit(question)
  }
  const answer = (await msg.channel.awaitMessages(
      m => id === m.author.id, 
      { max: 1}
    )
  ).first()
  if(!answer || answer.content.toLowerCase() === 'anuluj')
    return cancel(msg, menuMessage)
  answer.delete()
  return answer
}

module.exports = {
  help: {
    help: "Tworzy proste głosowanie w którym każdy użytkownik może wybrać tylko 1 opcje.",
    usage: "channel > message > options"
  },
  async process (msg, args) {
    if(msg.client.static.ekipaRole.comparePositionTo(msg.member.roles.highest) > 0) return msg.reply("Nie masz wystarczających uprawnień!")

    if(msg.mentions.channels.size < 1 || !args[1] || isNaN(parseInt(args[1]))) {
      return msg.channel.send("Musisz **wspomnieć** kanał na którym odbędzie się głosowanie oraz podać **ile godzin** ma trwać!")
    }
    const time = parseInt(args[1]) * 3600000
    const channel = msg.mentions.channels.first()
    const menu = new Discord.MessageEmbed({
      color: 9880163, // 0x5290ce,
      author: {
        name: 'Głosowanie!',
        icon_url: msg.author.avatarURL()
      },
      description: `Tworzenie głosowanie które odbędzie sie na kanale ${channel} i będzie trwać ${time / 3600000}h. Możesz w każdej chwili napisać anuluj aby anulować.`,
      fields: [{
          name: 'Nazwa',
          value: '*Brak!*'
        }, {
          name: 'Wiadomość',
          value: '*Brak!*'
        }, {
          name: 'Opcje',
          value: '*Brak!*'
        }
      ]
    })
    const { id } = msg.author
    const menuMessage = await msg.channel.send({ embed: menu })
    const infoMessage = await msg.channel.send('Jaka ma być **nazwa lub pytanie** głosowania?')

    const title = await getOption(id, infoMessage, null, menuMessage)
    if(!title) return;
    menu.fields[0].value = title.content
    menuMessage.edit({ embed: menu })

    const desc = await getOption(id, infoMessage, 'Jaka ma być **wiadomość lub opis** głosowania?', menuMessage)
    if(!desc) return;
    menu.fields[1].value = desc.content
    menuMessage.edit({ embed: menu })

    const options = []
    const addOption = async () => {
      const option = await getOption(id, infoMessage, 'Podaj opcje wyboru i reakcje do niej, np. "⭐ - Tak" używaj tylko podstawowych emotek, lub napisz "done" aby rozpocząć głosowanie!')
      if(!option) return null;

      if(option.content.toLowerCase() === 'done') return true;

      const parts = option.content.split(/ ?- ?/)
      if(parts.length < 2) return addOption();

      options.push({ reaction: parts.splice(0,1)[0], name: parts.join('-') })
      menu.fields[2].value = options.map(o => `${o.reaction}: "${o.name}"`).join("\n")
      menuMessage.edit({ embed: menu })
      return addOption();
    }
    const res = await addOption()
    if(res === null) return; // canceled
    infoMessage.delete()
    menuMessage.delete()

    msg.channel.send(`Tworzę głosowanie na kanale ${channel}`)

    const embed = new Discord.MessageEmbed({
      color: 0x5290ce,
      author: {
        name: `Głosowanie od ${msg.author.username}!`,
        icon_url: msg.author.avatarURL()
      },
      title: title.content,
      description: `**${desc.content}**\n*Używaj reakcji aby głosować!*\n_Będzie trwać do **${new Date(Date.now() + time).toLocaleString()}**_\n${options.map(o => `${o.reaction} - ${o.name}`).join("\n")}`,
    })

    // there is some code higher that created the `embed` and other variables but it works fine and my problem is only with reaction collector

    const poll = await channel.send({ embed })

    const reacted = new Map()
    const reactions = []
    
    for(const option of options) {
      try {
        const messageReaction = await poll.react(option.reaction)
        reactions.push(messageReaction)
      } catch (err) {
        console.log("Poll error", err.message)
      }
    }
    
    const collector = new Discord.ReactionCollector(poll, () => true, { time, dispose: true })

    collector.on('collect', async (reaction, user) => {
      if(user.id === msg.client.user.id) return;
      if(
        !reactions.some(r => r.emoji.name === reaction.emoji.name || r.emoji.id === reaction.emoji.id) 
        || reacted.has(user.id)
      ) {
        reaction.users.remove(user)
        return;
      }

      console.log('collect event and allow')
      reacted.set(user.id, reaction.emoji.name)
    })

    collector.on('remove', (reaction, user) => {
      if(reacted.has(user.id) && reacted.get(user.id) !== reaction.emoji.name) {
        return;
      }
      reacted.delete(user.id)
    })

    collector.on('end', collected => {
      const results = options.map(option => {
        const reaction = poll.reactions.get(option.reaction)
        return `${option.name} - ${reaction ? reaction.users.size -1 : 0}`
      })

      embed.color = 0xed1745
      embed.description = `**${desc.content}**\nGłosowanie się zakończyło!\n\n**Wyniki:**\n${results.join("\n")}`
      poll.edit({ embed })
      poll.reactions.removeAll()
    })
  }
}

// https://hastebin.com/kijahoheju.js
