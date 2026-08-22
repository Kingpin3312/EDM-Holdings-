CHATBOT RELAY — going live
==========================
The demo page talks to the API directly, which is fine for testing and
wrong for a public website: a key in the page is a key anyone can lift.
This relay fixes that. It holds the key and the assistant's instructions
on the server; the page only ever talks to the relay.

1. Create the API account in the company's name and get a key.
2. On the server:  ANTHROPIC_API_KEY=sk-...  node relay.js
   Node 18 or newer. No packages to install.
3. Route the path /chat on the website domain to this relay
   (standard reverse-proxy line in nginx, Caddy or the host's panel).
4. In edm-chatbot.html, make two small changes in the send() function:
   - the fetch URL becomes '/chat'
   - the request body becomes JSON.stringify({messages: history})
   - the reply is read from data.reply instead of data.content
   Three lines. Nothing else changes — the voice and rules now live
   server-side where nobody can tamper with them.
5. Test before announcing: ask it for a rate (it must decline and offer
   the priced tender), and ask if it's human (it must answer straight).
