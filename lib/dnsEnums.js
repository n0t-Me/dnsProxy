const flipObj = obj => {
    return Object.keys(obj).reduce((ret, key) => {
        ret[obj[key]] = key;
        return ret;
    }, {});
}

const TYPE = {
    A:     1,
    NS:    2,
    MD:    3,
    MF:    4,
    CNAME: 5,
    SOA:   6,
    MB:    7,
    MG:    8,
    MR:    9,
    NULL:  10,
    WKS:   11,
    PTR:   12,
    HINFO: 13,
    MINFO: 14,
    MX:    15,
    TXT:   16,
    AXFR:  252,
    MAILB: 253,
    MAILA: 254,
    '*':   255,
};

const CLASS = {
    IN: 1,
    CS: 2,
    CH: 3,
    HS: 4,
    '*': 255,
};

const revTYPE = flipObj(TYPE);
const revCLASS = flipObj(CLASS);

module.exports = { TYPE, CLASS, revTYPE, revCLASS };
