/* 
 * A custom dns proxy implementation
 * doesn't support custom dns records
 * made to stop ads (inspired from pi-hole)
 *
 */

const dgram = require('node:dgram');
const { dnsQuestion } = require('./lib/dnsQuestion.js');
const { dnsForward } = require('./lib/dnsForward.js');
const { blackList } = require('./lib/blacklist.js');
const { createClient } = require('redis');
const { metricServer } = require('./services/metricService.js');

class dnsProxy {
    ip;
    port;
    fwdServer;
    fwdPort;
    blacklist;
    client;

    constructor(ip, port, blacklist, fwdServer, fwdPort, metricServerPort) {
        this.ip = ip;
        this.port = port;
        this.socket = new dgram.createSocket('udp4');
        this.forwarder = new dnsForward(fwdServer, fwdPort);
        this.mServer = new metricServer(metricServerPort || 8080);
        this.blacklist = blackList.open(blacklist || 'blacklist.txt');
        this.blacklist.importToRedis();
        this.client = createClient();
        this.client.connect();
    }

    send(data, rinfo) {
        this.socket.send(data, 0, data.length, rinfo.port, rinfo.address);
    }

    async getResponse(req, rinfo) {
        const question = dnsQuestion.getQuestionFromBuffer(req, 12);
        const isIn = await this.blacklist.rcontain(question.QNAME);
        if ( isIn ) {
            console.log(`[LOG] Blocked ${question.QTYPE} // ${question.QNAME} from ${rinfo.address}:${rinfo.port}`);
            this.client.ZINCRBY("blacklist", 1, question.QNAME);
            return req;
        }
        console.log(`[LOG] Accepted ${question.QTYPE} // ${question.QNAME} from ${rinfo.address}:${rinfo.port}`);
        const {val, isCached} = await this.isCached(question.QNAME);
        if (isCached) {
            return val
        }
        const res = await this.forwarder.forward(req);
        this.cache(question.QNAME, res);
        return res;
    }

    cache(qname, resp) {
        this.client.set(qname, JSON.stringify(resp));
        this.client.expire(qname, 120); //Live for 120 sec (2 min)
    }

    async isCached(qname) {
        const a = await this.client.get(qname);
        if (a) {
            const res = new Buffer.from(JSON.parse(a));
            return (res, true);
        }
        return (null, false);
    }

    start() {
        this.socket.on('message', (msg, rinfo) => {
            this.getResponse(msg, rinfo)
                .then(res => {
                    this.send(res, rinfo);})
                .catch(err => {
                    console.log(err);
                    this.send(req, rinfo);
                });//Again just send it back
        });
        this.socket.bind(this.port, this.ip);
    }

    startMServer() {
        this.mServer.listen();
    }
}

module.exports = { dnsProxy }