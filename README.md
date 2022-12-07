# dnsProxy

A simple project I made to learn some Javascript. Inspired from [pi-hole](https://github.com/pi-hole/pi-hole) :P

## How it works ?

So it's a simple dns server that take a request forward it to `8.8.8.8` and return the response.

But before forwarding it, it check the domain name that the user want to resolve if it's in the blacklist then block the request by echo-ing it back.

If it wasn't there it forward it normally, I also added some caching to make things a little faster the TTL is 120 sec ( 2 min )

Pretty simple right :D

## Setting up the server

I assume you have node.js and redis already installed if not [this may help you](https://www.google.com) :)

1. Clone this repo

2. Install dependencies `npm install`

3. Run the redis server if it's not up

4. Start the proxy `npm start` you will need to enter your sudo password since we are using port 53 ( priviliged port )

5. Enjoy (unless it crashes :P)

If you are using windows you may need to do some modifications you are on your own :)

## Usage

Now that everything is set you simply need to change your dns server to your computer from here you have two choices:

1. Filter only ads on your computer

2. Filter ads for the whole network

You may probably want the second choice. So what you need to do is go to your router parameters, look for dns server (probably under DHCP conf), change it to your local ip.

However if you want to filter only for your computer, just go to network parameters and change your dns server to `127.0.0.1` (loopback address) or set a new nameserver in /etc/resolv.conf
