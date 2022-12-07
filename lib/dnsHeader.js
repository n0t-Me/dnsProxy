//Useless thing that I made .toBuffer is probably not working
class dnsHeader {
    ID;
    FLAGS;
    QDCOUNT;
    ANCOUNT;
    NSCOUNT;
    ARCOUNT;

    constructor(ID, FLAGS, QDCOUNT, ANCOUNT, NSCOUNT, ARCOUNT) {
        this.ID = ID;
        this.FLAGS = {
            QR: FLAGS.QR,
            OP: FLAGS.OP,
            AA: FLAGS.AA,
            TC: FLAGS.TC,
            RD: FLAGS.RD,
            RA: FLAGS.RA,
            Z:  FLAGS.Z,
            RC: FLAGS.RC,
        };
        this.QDCOUNT = QDCOUNT;
        this.ANCOUNT = ANCOUNT;
        this.NSCOUNT = NSCOUNT;
        this.ARCOUNT = ARCOUNT;
    }

    static fromBuffer(buffer) {
        const flags = buffer.readUInt16BE(2);
        const flagsObj = {
            QR: flags & 1,
            OP: (flags >> 1) & 7,
            AA: (flags >> 4) & 1,
            TC: (flags >> 5) & 1,
            RD: (flags >> 6) & 1,
            RA: (flags >> 7) & 1,
            Z : (flags >> 8) & 7,
            RC: flags >> 11,
        };
        return new this(
            buffer.readUInt16BE(),
            flagsObj,
            buffer.readUInt16BE(4),
            buffer.readUInt16BE(6),
            buffer.readUInt16BE(8),
            buffer.readUInt16BE(10),
        );
    }

    toBuffer() {
        const buffer = new Buffer.alloc(12);
        const arr = Object.values(this);
        const flags = Object.values(this.FLAGS).map(i => i.toString(2));
        flags[1] = "0".repeat(3 - flags[1].length) + flags[1];
        flags[6] = "0".repeat(3 - flags[6].length) + flags[6];
        arr[1] = Number.parseInt(flags.reverse().join(""), 2);
        arr.forEach((e, i) => {
            buffer.writeUInt16BE(e, 2 * i);
        });

        return buffer;
    }
}

module.exports = { dnsHeader };
