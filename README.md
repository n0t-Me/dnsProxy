# dnsProxy

A simple project I made to learn some Javascript. Inspired from [pi-hole](https://github.com/pi-hole/pi-hole) :P

## How it works ?

So it's a simple dns server that take a request forward it to `8.8.8.8` and return the response.

But before forwarding it, it check the domain name that the user want to resolve if it's in the blacklist then block the request by echo-ing it back.

If it wasn't there it forward it normally, I also added some caching to make things a little faster the TTL is 120 sec ( 2 min )

Pretty simple right :D

## Usage

I assume you have node.js and redis already installed if not [this may help you](https://www.google.com) :)

1. Clone this repo

2. Install dependencies `npm install`

3. Run the redis server if it's not up

4. Start the proxy `npm start` you will need to enter your sudo password since we are using port 53 ( priviliged port )

5. Change your dns server to your local ip (either on your router if you want to filter the whole network or simply your computer)

6. Enjoy (unless it crashes :P)

If you are using windows you may need to do some modifications you are on your own :)
