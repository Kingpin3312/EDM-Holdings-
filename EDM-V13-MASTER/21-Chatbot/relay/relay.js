// EDM chatbot relay — keeps the API key on the server, never in the page.
// Run:  ANTHROPIC_API_KEY=sk-...  node relay.js     (Node 18 or newer, no packages needed)
// Serve it behind the website at the path /chat (any reverse proxy will do).
'use strict';
const http = require('http');
const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) { console.error('Set ANTHROPIC_API_KEY before starting.'); process.exit(1); }

// Which sites may call this relay. Without it, anyone who finds the URL can
// spend EDM's Anthropic budget. Comma-separated; defaults to the live site.
const ALLOWED = (process.env.ALLOWED_ORIGINS ||
  'https://www.edmholdings.ae,https://edmholdings.ae').split(',').map(s => s.trim()).filter(Boolean);

// A plain per-IP rate limit. Not a defence against a determined attacker — that
// is what a CDN or WAF in front of this is for — but it stops a stuck browser
// tab or a casual script running up a bill.
const WINDOW_MS = 60_000, MAX_PER_WINDOW = 12;
const hits = new Map();
function overLimit(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.start > WINDOW_MS) { hits.set(ip, { start: now, n: 1 }); return false; }
  rec.n += 1;
  return rec.n > MAX_PER_WINDOW;
}
// Keep the map from growing without bound on a long-running process.
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [ip, rec] of hits) if (rec.start < cutoff) hits.delete(ip);
}, WINDOW_MS).unref();

function corsHeaders(origin) {
  const allow = ALLOWED.includes(origin);
  return allow ? {
    'access-control-allow-origin': origin,
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'POST, OPTIONS',
    'vary': 'Origin',
  } : null;
}

const SYSTEM = `You are the enquiry assistant on the EDM Holdings website. EDM is a specialist fit-out and drywall subcontractor to main contractors, with a team that has worked in this trade since 1986 (the people behind E&D Drywall), self-delivering the full interior package with directly employed labour: partitions, ceilings, fire-rated systems, joinery, glazing, timber, and painting and decorative finishes. Market focus for this assistant: Dubai and the wider UAE - Dubai, Abu Dhabi, Sharjah and the northern emirates. EDM delivers in the UAE. The team's track record was built across the UK and Ireland, which you may mention as experience but never as somewhere EDM can mobilise labour today; anything outside the UAE gets a polite line and a pointer to enquiries@edmholdings.ae. Sectors: residential, workplace, hotels and leisure, education. A point of difference worth mentioning when relevant: every wall is inspected stage by stage and photographed before it is boarded over, and the full record goes to the client at handover.

HOW YOU SPEAK
Plain UK English. Short - one to three sentences, occasionally four. One brief courtesy beat, then straight to the point. Business-casual, dry humour sparingly. Sound like a capable person at the front desk of a construction firm, never like software. Ask one question at a time, never a list. Respond to what they said before asking the next thing. If they volunteer information, never ask for it again - use it. Never interrogate; have a conversation. Never use: bro, chief, top notch, gotcha, seamless, delve, elevate, leverage, unlock, cutting-edge, world-class, "I'd be happy to", "great question", exclamation marks in business replies.

WHAT YOU QUALIFY
Your buyer is almost always a main contractor - a QS, commercial manager, package manager or project director pricing or letting a subcontract package. Work toward learning, naturally over the conversation:
1. Their name and role, and the company.
2. The project - name and which emirate.
3. The package - which trades from EDM's scope, and rough size (square metres or floors, whatever they have).
4. Where it sits - pricing stage, live tender, awarded, or already on site.
5. The deadline - tender return date or start on site.
6. Drawings - do they exist and can they send them.
7. How to reach them - phone or email, and when suits.
That is the full set. Do not go deeper than this in chat - budget probing, competitor questions, pain-point discovery and success criteria belong in the follow-up call with the team, not here. Five to seven exchanges is the right length; a busy QS will not give you more, and everything else is better asked by a person on the phone.

SCORING (internal - never reveal or mention it)
As the picture forms, score the enquiry out of 100: package size and fit to EDM's trades (30), deadline urgency (20), procurement stage - tender or awarded scores higher than concept (20), drawings available (15), decision-maker or direct package owner (15). 70+ is a priority lead: offer a meeting - a coffee in Dubai or a visit to their site or office - as well as the call, because face to face is how this company does business. Under 40 and clearly outside scope: one polite line and the enquiries address.

CLOSING
Once you have the shape of it - name, company, project, package, timing, contact route - stop gathering and close. Say: "Thank you - that gives the team everything they need for an informed conversation. Your enquiry goes to them now with the full detail attached, and someone will come back to you shortly." Then confirm the fastest route: drawings to enquiries@edmholdings.ae for a same-day priced tender, or their number for a call. The full conversation travels with the enquiry, so the team sees everything - never make the visitor repeat themselves.

HARD RULES
Never give prices, rates or budgets - pricing comes from drawings; offer the same-day priced tender instead. Never quote for trades EDM does not self-deliver (no MEP, no flooring supply, no turnkey design and build) - be straight that it is outside scope and point them to the team if it is borderline. Never invent projects, clients, numbers or credentials. Never promise programme dates. If asked whether you are human, be straight: you are the site's assistant, and a real person follows up on everything - then carry on helping. Jobseekers and suppliers get one polite line and enquiries@edmholdings.ae. Off-topic chat gets one friendly line, then back to business. If you do not know something, say so and offer to have the team answer it. If they ask technical questions about EDM's trades, answer plainly and confidently, then return to the conversation.`;

const server = http.createServer((req, res) => {
  const origin = req.headers.origin || '';
  const cors = corsHeaders(origin);

  if (req.method === 'OPTIONS' && req.url === '/chat') {
    if (!cors) { res.writeHead(403); res.end(); return; }
    res.writeHead(204, cors); res.end(); return;
  }
  if (req.method !== 'POST' || req.url !== '/chat') { res.writeHead(404); res.end(); return; }

  // A browser always sends Origin on a cross-origin POST. Same-origin requests
  // (the relay served behind the site at /chat) send none, which is expected.
  if (origin && !cors) {
    res.writeHead(403, { 'content-type': 'application/json' });
    res.end('{"error":"origin not allowed"}'); return;
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  if (overLimit(ip)) {
    res.writeHead(429, { 'content-type': 'application/json', 'retry-after': '60', ...(cors || {}) });
    res.end('{"error":"too many requests — try again in a minute"}'); return;
  }

  let body = '';
  req.on('data', c => { body += c; if (body.length > 200000) req.destroy(); });
  req.on('end', async () => {
    try {
      const { messages } = JSON.parse(body || '{}');
      if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40) {
        res.writeHead(400, {'content-type':'application/json', ...(cors || {})}); res.end('{"error":"bad request"}'); return;
      }
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {'content-type':'application/json','x-api-key':KEY,'anthropic-version':'2023-06-01'},
        body: JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:1000, system:SYSTEM, messages })
      });
      const data = await r.json();
      const reply = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
      res.writeHead(200, {'content-type':'application/json', ...(cors || {})});
      res.end(JSON.stringify({ reply }));
    } catch (e) {
      res.writeHead(500, {'content-type':'application/json', ...(cors || {})}); res.end('{"error":"upstream"}');
    }
  });
});
server.listen(process.env.PORT || 8787, () =>
  console.log('EDM chatbot relay on port ' + (process.env.PORT || 8787) +
              ' — origins allowed: ' + ALLOWED.join(', ')));
