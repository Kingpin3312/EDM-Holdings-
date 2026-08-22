# Document sources

The PDFs in `03-Corporate-Documents` and on the website were, until V12, output
with no source. Changing one sentence meant rebuilding a document by hand,
which is why two incorrect claims stayed in circulation for months.

This folder fixes that for the capability statement. Build with `./build.sh`.

## What's here

| File | Notes |
|---|---|
| `capability-statement-public.html` | Capability statement, public edition. 19 pages. |
| `corporate-brochure-public.html` | Corporate brochure, public edition. 17 pages. |
| `handover-standard.html` | The handover standard, one page. |
| `brand-guidelines.html` | Brand guidelines, 7 pages. Swatches drawn from the tokens. |
| `PHOTOGRAPHY-BRIEF-leadership.md` | Specs for the three missing portraits. |
| `assets/people/` | Leadership portraits. Only Kenny's exists today. |
| `assets/edm-doc.css` | Brand stylesheet. Tokens match `BRAND-TOKENS.md`. |
| `assets/fonts/` | Montserrat 300 / 400 / 600 / 700. **No 500** — the V11 PDFs used Medium, which is not in the system. |
| `build.sh` | Renders to PDF and writes it to both output locations |

## Rules for editing

The PDF is output. Never edit it, never hand-correct it — change the HTML and
rebuild, or the two drift apart again.

**Public edition** names no client, project or main contractor. Consent for
Khazna QAJ01 and PMK Group is verbal only. When written consent is filed, a
tender edition can be branched from this file — keep them clearly separated and
keep the named one out of the website folder.

No turnover figure. No absolute safety claim. Delivery is the UAE; the UK,
Ireland and Australia are the team's track record. 1986 attaches to the trade
and the people. All five positions are set out in `DECISIONS.md`.

## Two technical notes worth keeping

**Tick marks are drawn in CSS, not typed as a glyph.** The V11 PDFs — including
the Brand Guidelines — pulled DejaVu Sans into the file purely to render a ✓ or
a ✕. A brand document containing a second typeface is an avoidable embarrassment.
`.card .tick::after` draws it with two borders and a rotation.

**Card grids use `display: table`, not flexbox.** WeasyPrint does not wrap flex
items reliably; the first build collapsed the six cards into a single column and
the second, using floats, overlapped the paragraph beneath. Table rows render
exactly and keep the cells equal height.

## The two documents do different jobs

Keep it that way. The **capability statement** is a credentials document for
procurement: what we deliver, how, to what standard, and what happens at
pre-qualification. The **brochure** is the company in full for anyone deciding
whether they want to work with us at all: the model, the craft, the sectors,
the people, careers.

Where they overlap — self-delivery, the handover standard, the four systems —
the brochure carries the short version and the capability statement carries the
detail. If the brochure starts growing tables of specifications, it has drifted.

## Leadership

The four leadership cards use one shared component (`.lead-grid` in
`edm-doc.css`) and one set of bios, used word for word in the website, the
capability statement and the brochure. Change a bio in one place and change it
in all three, or the inconsistency comes straight back.

Photographs: only Kenny's exists. The other three fall back to an initials
monogram, which is deliberate and on-brand — but a monogram beside a real
photograph is exactly the inconsistency this was meant to fix, so treat the
shoot brief as live work, not a nice-to-have.

## Approval note

Page 3 of the brochure is written in the Chief Executive's voice. It contains
positions rather than anecdotes, and nothing that isn't evidenced elsewhere in
the pack — but it carries his name. He reads and approves it before issue.

## Automated checks

`build.sh` renders both documents and then greps the output for the three
things that must never appear in a public edition: client names, the turnover
figure, and "100%". All counts must be zero. It also lists embedded fonts —
anything other than Montserrat means a glyph was typed instead of drawn.

## Still to build

Every client-facing PDF now has a source. What doesn't: the capability deck is a .pptx and sits outside this system. Its text was
corrected directly in V12, but it has no source in the sense the PDFs now do.
If it keeps earning its place, consider rebuilding it from HTML too so one
change propagates everywhere.
