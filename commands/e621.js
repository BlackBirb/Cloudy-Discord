const url = "https://e621.net";
const user = "BlackBird";
const request = require("request")

const ratings = {
    s: "safe",
    q: "questionable",
    e: "explicit"
}

const toReplace = [
    {f: "\\[b\\]", t: "**"},
    {f: "\\[\\/b\\]", t: "**"},
    "h1\\.",
    "h2\\.",
    "h3\\.",
    "h4\\.",
    "h5\\.",
    "h6\\."
]

function req(link, settings) {
    var reqUrl = url + link;
    var options = {
        url: reqUrl,
        body: settings,
        headers: {
            "User-Agent": "node-e621/1.0 " + user
        },
        json: true
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve({
                    statusCode: response.statusCode,
                    data: body
                })
            }
            else {
                resolve({
                    statusCode: response.statusCode,
                    error: error,
                    response: response,
                    data: false
                })
            }
        })
    });
}


module.exports = {
    help: {
        help: "Guess",
        uasge: "<?!page> <...tags> <?!image>"
    },

    process: async (msg, suffix) => {
        if(!msg.channel.nsfw) return;
        if(!suffix.length) return msg.channel.send("Ta komenda potrzebuje parametrów aby działać")

        let tags = "";
        let page = 1;
        let limit = 10
        let image = false
        if(!isNaN(suffix[0])) {
            page = Math.round(parseInt(suffix.shift()))
            if(page < 1) return msg.reply(`Nie moge znaleść nic na stronie ${page}...`)
        }
        if(!isNaN(suffix[suffix.length-1])) {
            let i = Math.round(parseInt(suffix.pop()))
            if(i > 99) return msg.reply("Bez przesady...")
            else if(i < 1) return msg.reply(`Nie moge znaleść ${i} zdjęcia...`)
            if(i > 10) limit = i
            image = i-1
        }

        if(suffix.length > 6) return msg.reply("Możesz użyć maksymalnie 6 tagów na raz!")

        let settings = {
            tags: suffix.join(" "),
            page: page,
            limit: limit
        }
        try {
            let res = await req("/post/index.json", settings)
            if(res.data.length === 0) return msg.reply("Nic nie znalazłem.")
            
            if(res.statusCode !== 200) return msg.reply("Internal error im too lazy to hande it => res SC"+res.statusCode)
            let data = res.data
            
            if(!image) image = Math.floor(Math.random()*data.length)
            data = data[image]


            let desc = data.description.length > 100 ? data.description.substring(0, 100) + "[...]" : data.description

            toReplace.forEach(e => {
                let from = e
                let to = ""
                if(typeof e === "object") {
                    from = e.f
                    to = e.t
                }
                desc = desc.replace(new RegExp(from, "gi"), to)
            })

            let embed = {
                author: {
                    name: data.artist ? `Author${data.artist.length > 1 ? "s" : ""}: ${data.artist.join(",")}`
                    : "No authors?"
                    ,
                    url: data.source
                },
                image: {
                    url: data.file_url
                },
                title: "Link to e621",
                url: `https://e621.net/post/show/${data.id}/`,
                description: `Description: ${desc}`
            }
            return msg.reply(`OwO what's this`, {embed})
        }
        catch(err) {
            console.log(err)
            return msg.reply("Nie moge nic znaleźć.")
        }
        
    },

    group: "hidden",
    expectsSuffix: true,
    noSuffix: "Ta komenda wymaga parametrów!\n`cd!e621 <?!page> <...tags> <?!image>`"
}

//i was just... testing here >.-.<
