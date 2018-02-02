const fs = require("fs");
const EventEmitter = require("events");
const wget = require("wget-improved");

module.exports = class Recorder extends EventEmitter {
    constructor(url) {
        super();
        this.channel = null;
        this.url = url

        this.recording = false
        this.worker = null;
        this.name = null;
    }

    start() {
        if(this.recording) return false
        let name = this.newFileName
        const dw = wget.download(this.url, name, {});
        this.recording = true
        this.name = name
        dw.on("error", err => {
            this.end("Nagrywanie sie wywróciło xD")
            this.emit("error", err)
        });

        dw.on("start", fileSize => {
            this.emit("start", fileSize)
        });

        dw.on("end", output => {
            this.end("Nagrywanie zakończone!")
            this.emit("end", output)
        });
        this.worker = dw
        this.timeout = setTimeout(_=> {
            this.forceFinish()
        }, 10800000)
        return true
    }

    stop() {
        if(!this.recording) return false
        this.worker.req.abort()
        this.recording = false
        this.channel = null;
        return true
    }

    end(msg) {
        this.recording = false      
        this.name = null;
        if(this.channel !== null) this.channel.send(msg)
    }
        
    forceFinish() {
        this.worker.req.abort()
        if(this.channel !== null) this.channel.send("Nagrywanie trwa ponad 3h! Przestaje nagrywać.")    
        this.name = null;
        this.recording = false 
    }

    get newFileName() {
        return `./records/Audycja ${new Date().toLocaleString().replace(/:/g,"-")}.mp3`
    }
}


//var a = new Recorder({}, "http://188.116.8.133:8000/stream")