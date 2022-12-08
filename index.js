const { dnsProxy } = require('./dnsProxy.js');

const proxy = new dnsProxy('0.0.0.0', 53, 'blacklist.txt');
proxy.start();
