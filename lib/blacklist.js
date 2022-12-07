/*
 *
 * I made this so my ad blocker support pi hole blocklists
 * and yes they may containt local addresses (localhost ...)
 * but I assume it's already defined by /etc/hosts :)
 *
 */

const { readFileSync } = require('fs');
const { createClient } = require('redis');

class blackList {
    entries;
    client;

    constructor(entries) {
        this.entries = entries;
        this.client = createClient();
        this.client.on('error', err => console.log("Redis ERR: ",err));
        this.client.connect();
    }

    static open(path) {
        console.log("[LOG] Reading blacklist content. This may take a while...");
        const entries = readFileSync(path).toString().split("\n")
            .filter(i => i.trim().length != 0) // Filter blank lines
            .filter(i => !i.trim().startsWith('#') ) // Filter comments
            .map( (e, i) => {
                const domain = e.split(' ')[1];
                return domain;
            });
        console.log("[LOG] Done Reading :)");
        return new this(entries);
    }

    importToRedis() {
        this.entries.forEach(e => this.client.ZADD("blacklist", {score: 0, value: e}));
        console.log("Imported to redis :)");
    }

    async rcontain(s) {
        const res = await this.client.ZRANK("blacklist", s);
        return res !== null;
    }
}

module.exports = { blackList };
