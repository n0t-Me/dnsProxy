const { revCLASS, revTYPE } = require('./dnsEnums.js');

class dnsQuestion {
    QNAME;
    QTYPE;
    QCLASS;

    constructor(QNAME, QTYPE, QCLASS) {
        this.QNAME = QNAME;
        this.QTYPE = QTYPE;
        this.QCLASS = QCLASS;
    }

    static getQuestionFromBuffer(buffer, offset) {
        //Use the same buffer as header used so we set 12 as offset
        offset = offset || 12;
        const labels = [];
        let i = offset;
        while (buffer.readUInt8(i) != 0) {
            let length = buffer.readUInt8(i);
            i += 1;
            labels.push(buffer.slice(i, i + length).toString());
            i += length;
        }
        i += 1;
        const QTYPE = revTYPE[buffer.readUInt16BE(i)];
        const QCLASS = revCLASS[buffer.readUInt16BE(i+2)];
        return new this(labels.join("."), QTYPE, QCLASS);
    }
}

module.exports = { dnsQuestion };
