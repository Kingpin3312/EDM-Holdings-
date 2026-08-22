EDM CHATBOT — the website's front desk
======================================

What it is
----------
A working enquiry assistant for edmholdings.ae, scoped to Dubai and the
UAE. It answers like a capable person on the front desk: one courtesy
line, straight to the point, plain English. It qualifies each enquiry
naturally — who, company, project, package, timeline — then closes
toward a call, a coffee, or drawings sent to enquiries@edmholdings.ae
for a priced tender.

The rules built into it
-----------------------
- Never gives prices or rates; offers the same-day priced tender instead.
- Never invents projects, clients, figures or programme dates.
- Asked if it's human, it's straight about being the site's assistant —
  and a real person follows up on everything.
- Jobseekers, suppliers and off-topic visitors get one polite line and
  the enquiries address.
- Enquiries from outside the UAE get pointed to the team by email.
- The full banned-vocabulary list is written into its instructions, so
  it cannot drift into machine-speak.

The qualification upgrade (July 2026)
-------------------------------------
The assistant now runs a structured qualification behind its natural
conversation. It works toward seven things - name and role, company,
project and emirate, package and size, procurement stage and deadline,
drawings, and contact route - one question at a time, never as a form,
and never re-asking anything the visitor already said. It scores each
enquiry internally (package fit, urgency, stage, drawings, decision
maker); strong leads are offered a meeting, not just a call. It stops
at five to seven exchanges by design - budget, competitors and deeper
discovery belong in the follow-up call, where they land better coming
from a person. The full conversation travels with every enquiry, so
the team reads the whole exchange and the visitor never repeats
themselves. It will not qualify work outside EDM's self-delivered
trades - no MEP, flooring supply or turnkey design and build.

Getting it onto the live site
-----------------------------
Open edm-chatbot.html in the Claude app or claude.ai and it works as-is
for testing. On the live website it needs one thing this file cannot
carry: an API key. Set up an Anthropic API account in the company's
name (same rule as everything else — never a personal account), and
have the developer put the key behind a small relay on the server so it
never sits in the page for anyone to lift. Budget-wise, usage at
enquiry volumes is small — pounds a month, not hundreds.

Worth doing on day one
----------------------
Test it like a suspicious buyer: ask for rates, claim to be from
outside the UAE, try to make it promise a date. It should hold the
line every time. If it ever doesn't, the instructions at the top of
the file are plain text — adjust the wording and test again.
