# dnsProxy

A simple project I made to learn some javascript. Inspired from [pi-hole](https://github.com/pi-hole/pi-hole) :P

## Usage

This is a simple dns proxy by filtering the domains of ads providers you can be free from them :) you just need to add your local ip as a dns server in your router, or if you don't want to filter the whole network just set it as a dns server for your computer here is [how to do it](https://www.google.com)

Before you start you will need a redis server.

Install dependencies `npm install` then run `npm start` you need to provide a blacklist file in the project root directory named `blacklist.txt` you can use this [blacklist.txt](https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts)

After that you can see some metrics by visiting [localhost:8080](http://localhost:8080)
