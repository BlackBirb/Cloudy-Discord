const snek = require("snekfetch")
const { apiURI, apiToken } = require("../config.json")

const songExist = async (title) => {
    const res = await snek.get(apiURI + "data/searchsong?title=" +title).set("Authorization", apiToken)
    const { body } = res
    if(res.status !== 200) throw res
    return body
}

module.exports.request = async title => {
    const res = await snek.post(apiURI + "requestsong")
                          .set("Authorization", apiToken)
                          .send({ title })
    const { body } = res
    return body
}

module.exports.songExist = songExist