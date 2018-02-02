/* Discord bot for CloudsDaleFM made by BlackBird#1638 */
const Discord = require("discord.js")
const fs = require("fs")
const rec = require("../utils/streamRecorder.js")
const apiGET = require("../utils/callAPI.js").get

const setGame = typeof process.argv[2] === "undefined" || process.argv[2].toLowerCase() !== "nogame"
console.log(`[${setGame}] Setting game on start`)
function now() {
    return `<${new Date().toLocaleString()}>`
}

class Bot extends Discord.Client {
    constructor() {
        super()
        this.static = {}
        this.commands = new Discord.Collection()
        this.config = require("../config.json")
        this.streamRecorder = new rec(this.config.listenURI)
    
        this.radio = {
            connection: null,
            channel: null,
            dispatcher: null,
            playing: false,
            cooldown: false
        }

        /** Load commands */
        let files = fs.readdirSync("./commands/")
        for(var file in files) {
            let cmdname = files[file].replace(".js","")
            let cmd = require(`../commands/${cmdname}.js`)
            this.commands.set(cmdname, cmd)
            console.log("Loaing command",cmdname)
        }
        /** Set event liseners */
        this.on("ready", this.readyEvent)
        this.on("message", msg => this.messageEvent(this, msg))
        this.on('guildMemberAdd', member => this.joinEvent(this, member))
        this.on('voiceStateUpdate', this.voiceUpdate)

        this.login(this.config.token);
    }

    readyEvent() {
        let guild = this.guilds.first()
        this.static = {
            nopeEmoji: guild.emojis.get(this.config.errEmoji),
            ekipaRole: guild.roles.get(this.config.roles.ekipa),
            acceptChannel: guild.channels.get("352406832150478859"),
            regulaminChannel: guild.channels.find("name", "regulamin")
        }
        this.setInterval(_=> {
            this.setPlaying(false)
        }, 15000)
        console.log(`${now()} Bot mounted, logged, and ready to play!`)
    }

    voiceUpdate(oldMember, newMember) {
        if(!this.radio.playing) return
        let channel = oldMember.voiceChannel ? oldMember.voiceChannel : newMember.voiceChannel
        if(!channel) channel = this.radio.channel
        if(channel.id !== this.radio.channel.id) return
        if(channel.members.size > 1) return
        if(this.radio.cooldown !== false) return
        this.radio.cooldown = setTimeout(_=>{
            if(this.radio.channel.members.size > 1) return this.radio.cooldown = false
            this.radio.dispatcher.end()
            this.radio.channel.leave()
            this.radio = { channel: null, connection: null, dispatcher: null, playing: false }
        },10000)
    }

    async setPlaying(title) {
        try {
            if(!title) {
                const body = await apiGET("data/playing")
                title = body.track
            }
            if(this.user.presence.activity && title === this.user.presence.activity.name) return;
            if(setGame) this.user.setActivity(title)
        } catch(err) {
            console.log(now(),"Error at getting song titile to set as game.")
            return console.error(err)
        }
    }
}
/** Require event handlers as "class functions" */
Bot.prototype.messageEvent = require("./messageHandler.js")
Bot.prototype.joinEvent = require("./joinHandler.js")
const bot = new Bot()

console.log("Running!")


/*
## start ##
color: 42962, description: "[Strona już otwarta dla wszystkich ale start wkrótce! ZAPRASZAMY!](https://www.cloudsdalefm.net)"

color: 42962, description: "Witamy na pierwszej audycji! Start o 19:00!"

@here Audycja się rozpoczeła! Możecie jej posłuchać na kanale głosowym oraz na naszej stronie!

Audycja zaczyna sie za 5 min! Zapraszamy do słuchania na strone https://www.cloudsdalefm.net/ !
*/




//random embed
function omgodwhyihavethisgeremovethisplznibba( ) {

const embedThatYouShouldIgnoreAKAformcserver = { //MC polox
    author: {
        name: "Zapraszamy na radiowy serwer Minecrafta!",
        icon_url: msg.guild.members.get("196682653729161216").user.avatarURL
    },
    description: "Jeden z naszych administratorów prowadzi radiowy server minecrafta! Aby sie połączyć użyjcie tego ip: **trixie.maxc.pl** na wersji 1.12.0 \n Możecie znaleźć na nim m.in.",
    color: 0x02ba6f,
    fields: [
        {
            name: "**System osiągnięć i poziomów**",
            value: "Za które otrzymujecie dodatkowe punkty doświadczenia i przedmioty za ich wykonywanie. Dostępne rangi: Scootaloo Derpy, Spike, Luna, Celestia, Discord (podczas gry również powstają nowe).\nZa wyższe poziomy otrzymujesz też dodatkowe funkcje :)\n**/aach list**"
        },
        {
            name: "**PaczVote**",
            value: "Pomaga w korzystaniu z komend głosowania (obecnie dostępne są dwa warianty), **\n/wv /tv**"
        },
        {
            name: "**System skinow**",
            value: "Daje możliwosc przypisania skina o instniejącym UUID"
        },
        {
            name: "**ExpBook**",
            value: "Jest to książka, która pozwala wam deponować i wypłacać punkty xp."
        },
        {
            name: "**System craftingow i lotu**",
            value: "Polega on na możliwosci zdobycia głów od mobów, jak i uproszczonym craftingu, rzeczy, które można jedynie znaleźć w lochach/twierdzach."
        }, 
        {
            name: "**MyHome**",
            value: "**/home set\n/myhome /home**"
        }
    ],
    thumbnail: {
        url: "https://cdn.discordapp.com/attachments/352408406923149312/373910171006795776/minecraft-1.png"
    },
    timestamp: new Date(),
    image: {
        url: "https://cdn.discordapp.com/attachments/352407781502091264/373927733656551434/unknown.png"
    },
    footer: {
        text: "Zapraszam! | Polox "
    }
}

const eeeeememebet = { //Benek wtorek
    author: {
        name: "Rebarok",
        icon_url: msg.guild.members.get("224166640345022464").user.avatarURL
    },
    color: 0x02ba6f,
    title: "Witajcie Drodzy sluchacze.",
    description: `Mam zaszczyt was poinformować, że **o godzinie 20:00** Nasz drogi **Benek** będzie czytał dla was fan fika który nazywa się **"Terror is the bestest pony"** który będzie się odnosił do święta Halloween.\nDo tego czasu radze zrobić popcorn i cydr jabłkowy! :smile:`,
    thumbnail: {url: "https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-0/s480x480/23130629_1375372519255077_3972196018883842015_n.png?oh=b4b55396326b724acd1e29b03445807a&oe=5AAE3C08"}
}

const sroda = { //ktoś środa
    author: {
        name: "Wieczorkiem w Las Pegasus",
        icon_url: msg.guild.members.get("224166640345022464").user.avatarURL
    },
    color: 0x02ba6f,
    title: "Hejo nasi najdrożsi.",
    description: `Mam przyjemność ogłosić wam, że o godzinie 20:00 rozpocznie się audycja pod tytułem "Wieczorkiem w Las Pegasus" gdzie wraz z Poloxem będziemy rozmawiać na temat MLP the movie i nie tylko. \nBędziemy również na koniec odpowiadać na wasze pytania.`,
    thumbnail: {url: "https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-9/22894407_1376705565788439_1938938489349793057_n.png?oh=250b4e9b02b1dfede7b58373387e7ff6&oe=5AA5EE68"},
    footer: {
        text: "~Rebarok"
    }
}

const twilimeet = {
    title: "V Twilightmeet - Edycja Świąteczna",
    description: "**Radio CloudsdaleFM jako honorowy patronat V Twilightmeeta ma zaszczyt zaprosić was na to wspaniałe spotkanie.**",
    fields: [
        {
            name: "Oto tekst od samych organizatorów:",
            value: "Ekipa lawendowej księżniczki zaprasza po raz kolejny na spotkanie pod jej patronatem :3 Tym razem spotykamy się w czwartą rocznicę powstania grupy facebookowej Bronies Twilight od której właściwie cała historia spotkań się zaczęła, i dla Was i dla nas. Jest nam niezmiernie miło, że jesteście z nami już cztery lata, cztery meety, a także mamy nadzieję, że pojawicie się i ten piąty raz."
        },
        {
            name: "Tym razem pod tytułem V Twilightmeet, świąteczno - rocznicowy",
            value: "Coraz trudniej nam was zaskoczyć nowościami, więc możecie spodziewać się raczej dość standardowej już formuły. Chociaż znając nasze przywiązanie do drobnych detali na które pozornie nikt nie zwraca uwagi jakaś zmiana tu czy tam z pewnością się pojawi. Zapewne w kwestii placówkowej :wink:"
        },
        {
            name: " Przy okazji łapcie link do ich posta :3",
            value: "https://www.facebook.com/events/729080663948352/"
        }
    ],
    image: {url: "https://i.imgur.com/cjad1Qb.jpg"}
}

}