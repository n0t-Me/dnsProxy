const { dnsProxy } = require('./dnsProxy.js');

const proxy = new dnsProxy('127.0.0.1', 53, 'blacklist.txt');
proxy.start();
proxy.startMServer();
