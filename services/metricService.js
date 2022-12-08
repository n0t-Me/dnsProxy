const { createClient } = require('redis');
const express = require('express');
const client = createClient();
const signale = require('signale');

class metricServer {
    constructor(port) {
        this.port = port;
        this.app = express();
        client.connect();
        this.app.use(express.static(__dirname + '/public'));
        this.app.get('/topBlacklist/:len', async (req, res) => {
            const len = +req.params.len;
            if ( isNaN(len) ) {
                res.json({status: "failure", value: "Enter a valid number"});
                res.end();
            }
            let results = await client.ZRANGE_WITHSCORES("blacklist", 0, -1);
            results = results.filter(e => e.score != 0);
            const tot = results.reduce((sum, e) => sum + e.score, 0);
            results = results.reverse().slice(0,len);
            res.json({status: "success", value: results, total: tot});
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            signale.info("Metric service listening on: ",this.port);
        });
    }
}

module.exports = { metricServer };
