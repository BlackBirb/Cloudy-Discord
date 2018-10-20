const fetch = require("snekfetch")
const { apiURI, apiToken } = require("../config.json")

module.exports = {
    get: async route => {
        let res = await fetch.get(apiURI + route).set("Authorization", apiToken)
        let { body } = res
        if(res.status !== 200) throw res
        return body
    },
    post: async route => {
        return "WIP"
    }   
}