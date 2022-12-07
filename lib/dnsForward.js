const dgram = require('node:dgram');

class dnsForward {
    server;
    port;

    constructor(server, port) {
        this.port = port || 53;
        this.server = server || "8.8.8.8";
    }

    forward(request) {
        return new Promise( (resolve, reject) => {
            const client = dgram.createSocket('udp4');

            client.on('message', (msg, info) => {
                resolve(msg)
            });

            client.send(request, this.port, this.server, error => {
                if (error) {
                    client.close();
                    reject(error);
                }
            });
        });
    }
}

module.exports = { dnsForward };
