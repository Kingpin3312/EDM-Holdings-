# EDM Holdings — project instructions

This repository is the single source of truth for EDM Holdings' brand, documents,
website, and the EDM OS platform. Read this file fully before doing anything.

## Who this is for

Christopher Simon, COO. Not a developer. Explain what you are about to do in
plain English before you do it, and say what could go wrong. Never assume
familiarity with tooling.

## What EDM Holdings is

Specialist interior fit-out and drywall contractor. Self-delivers the whole
interior package — partitions, ceilings, fire- and acoustic-rated systems,
timber, glazing, joinery, finishes — with directly employed labour, as a
subcontractor to Tier-1 main contractors.

Delivery entity: EDM Technical Services L.L.C (Dubai), wholly owned by
EDM Consultant FZCO.

## READ FIRST

`_V12-DECISIONS.md` at the root settles five positions: the licensed-scope
mismatch, the turnover figure, the safety claim, market wording and the 1986
attribution. Those decisions override anything you find in an older document.

**Decision 0 is closed (20/08/2026).** The licensed scope was confirmed to cover
the trades advertised, including aluminium and glazing and joinery. Write about
them normally. If the licensed activities ever change, this is the first thing to
re-check across the estate — the claim appears on 20 website pages, in both
documents and in the LinkedIn specialties list.

## HARD RULES — never break these

1. **Never invent a fact.** No clients, projects, values, dates, headcounts,
   certifications, accreditations, awards or safety statistics that are not
   already evidenced in this repository. If something would help but cannot be
   verified, write it under a heading `REQUIRES VERIFICATION` and stop.

2. **Client naming is consent-gated.** Khazna Data Centers, QAJ01 and PMK Group
   must not appear in any public-facing output until written consent is filed
   at `/consents/`. Verbal consent does not count. If `/consents/` is empty,
   use the unnamed alternatives.

3. **Never claim delivery capability outside the UAE.** The UAE entity is the
   delivery entity. Ireland, UK and Australia are separate companies and a
   heritage track record — describe them as the team's experience, never as
   places EDM can currently mobilise labour.

4. **"Since 1986" attaches to the trade and the team**, not to EDM Holdings as
   a trading entity. Write "our people have been doing this since 1986", never
   "EDM Holdings has traded since 1986".

5. **Never use absolute claims.** No "100%", "guaranteed", "always", "zero
   defects", "world-class", "leading", "premier". The "100% safety record"
   currently in the capability statement and corporate brochure is to be
   removed, not softened — replacement copy is in `_V12-DECISIONS.md`.

6. **No turnover figure in public documents.** It is removed from all
   public-facing material and lives only in the PQQ pack alongside the accounts
   that support it. Do not reinstate it, in any form, however it is phrased.

7. **Do not delete or overwrite anything in `/archive/`.** Superseded assets
   are kept deliberately.

## Brand tokens — the only permitted values

    ground      #FFFFFF
    emerald     #083819
    ink         #0F231B
    muted       #5C6F66
    hairline    #E4E6E0
    cube grey   #7C8282 and #9EA3A2   (logo artwork only)

Exceptions already agreed: `#25D366` / `#1EBE5B` for the WhatsApp button only.

`#0A4A21` currently appears 20 times in the site CSS as a hover state and is
NOT documented. Do not add more uses. Flag it, don't silently spread it.

Retired and must never reappear: any bone or ivory tint (`#F5F2EA`, `#F4F1E9`,
`#F2EFE7`), any sage, any bronze, any green other than `#083819`.

**Typeface: Montserrat only.** Four weights, and only four: Light 300,
Regular 400, SemiBold 600, Bold 700. **Medium 500 is not in the system.**
Headlines Bold with tight tracking, body Regular with generous line spacing,
labels Bold uppercase in emerald with wide tracking. Never a second family,
never a system font fallback that is allowed to show.

**Logo minimum size:** never reproduce the full lockup below 30mm wide in print
or 150px on screen. Below that, the cube alone. Clear space on every side at
least as tall as the "E" in EDM.

**Never a green background with white text** on a page or a cover. Pages stay
white with emerald as the accent. Table header rows are the one exception.

Logo: use the master artwork in `12-Logo-Masters/` or
`01-Brand-Identity/Logo/`. Never recreate the cube. Never redraw the wordmark.
Never place the logo over a busy photograph.

## Writing voice — applies to every word of output

UK English. Always. Programme, metre, colour, organisation, licence (noun).

Professional, transparent, plain. Business-casual. Medium-length sentences.
Dry humour occasionally. Bad news delivered plainly.

- "we" for company capability, "I" for personal commitments
- One brief courtesy line, then straight to the point
- Spoken numbering: "Firstly... Secondly..."
- Short closers: "Best", "Speak soon"
- Push toward meeting in person — coffee, face to face

**Banned words and phrases.** Do not use, in any output:
bro · chief · top notch · gotcha · sub-let · sub-letting ·
"Let's talk about your package" · thrilled · excited to announce ·
delighted to share · proud to announce · delve · leverage · robust ·
seamless · elevate · game-changer · unlock · testament · "in today's
fast-paced" · reach out · circle back

**It must not read as AI-written.** The tells to avoid: em dashes in every
paragraph, three-item lists in every sentence, "it's not just X, it's Y",
opening with a rhetorical question, closing by summarising what you just said.

## Repository layout

    /brand           tokens, logo masters, guidelines
    /website         the edmholdings.ae site
    /documents       client-facing PDFs and their sources
    /os              EDM OS (Next.js / NestJS / Prisma / Postgres)
    /gtm             go-to-market, LinkedIn system, content
    /consents        written client consents. Empty = nothing may be named.
    /archive         superseded assets. Read-only.

## How to work

- **Plan before editing.** Say what you will change, which files, and why.
  Wait for a yes on anything touching client-facing documents.
- **One concern per branch.** Never mix a content change with a code change.
- **Never regenerate a PDF without showing the diff in the source first.**
- **Every colour or font you write must come from the token list above.**
- **After any change to a client-facing document**, re-check it against the
  Hard Rules and report which rules you verified.

## Known open issues — do not "fix" silently, raise them

1. Trade licence copy to be filed in the PQQ pack — the scope is confirmed, the
   attachment is not yet on file.
2. Turnover and the safety claim are both settled in `_V12-DECISIONS.md` but
   cannot be applied until the capability statement and corporate brochure have
   editable sources. Building those sources is the first job worth doing.
3. DET registered email still points to the formation agent.
4. Four PDFs contain unembedded Helvetica. See the asset audit.
5. Corrected in V12: bone `#F5F2EA` had survived as the dominant colour in the workwear and vehicle
   livery mockups and the livery green was `#0E3A2C`.
6. There are no editable sources for the capability statement, corporate
   brochure, handover standard or brand guidelines. Only output PDFs exist.
