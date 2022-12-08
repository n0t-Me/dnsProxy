/*
 *
 * I made this so my ad blocker support pi hole blocklists
 * and yes they may containt local addresses (localhost ...)
 * but I assume it's already defined by /etc/hosts :)
 *
 */

const { readFileSync } = require('fs');
const { createClient } = require('redis');
const signale = require('signale');
const { Signale } = require('signale');


class blackList {
    client;

    constructor(entries) {
        this.client = createClient();
        this.client.on('error', err => signale.fatal(err));
        this.logger = new Signale({interactive: true, scope: 'blacklist'});
        this.logger.success("Initialized blacklist");
        this.client.connect();
    }

    ropen(path) {
        this.logger.await("Reading blacklist.txt ...");
        readFileSync(path).toString().split("\n")
            .filter(i => i.trim().length != 0) // Filter blank lines
            .filter(i => !i.trim().startsWith('#') ) // Filter comments
            .map( (e, i) => {
                const domain = e.split(' ')[1];
                return domain;
            })
            .forEach(e => this.client.ZADD("blacklist", {score: 0, value: e}));
        this.logger.success("Imported to redis :)");
    }

    async rcontain(s) {
        const res = await this.client.ZRANK("blacklist", s);
        return res !== null;
    }
}

module.exports = { blackList };
