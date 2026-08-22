# PQQ information pack — how to keep it right

**This document now has a source.** Built 22 August 2026; before that it was an
output-only PDF, which meant it could only be corrected by hand and sat outside
every automated check.

    source:  09-Document-Sources/pqq-information-pack.html
    build:   sh 09-Document-Sources/build.sh
    output:  13-Go-To-Market/EDM-PQQ-Information-Pack.pdf   (4 pages)

**Never edit the PDF.** Edit the HTML and rebuild, exactly as for the capability
statement and brochure.

## What changed when the source was built

Two corrections, both required by `DECISIONS.md`:

| Was | Now | Why |
|---|---|---|
| `Markets — UAE · Ireland · UK · Australia` | `Delivery market — United Arab Emirates`, with the UK and Ireland record stated separately as track record | Decision 3. This is the document that goes to a Tier-1 procurement team, so it was the worst remaining place for the four-markets claim. |
| `Established — 1986` | `Incorporated — [ date ]` and a separate `Trade heritage` row | Decision 4. Beside a licence number and a registered office, "Established 1986" reads as an incorporation date. A PQQ wants the real one. |

Two additions, both things a Tier-1 form asks for and the estate already evidences:

- **Contracting entity** — EDM Technical Services L.L.C, wholly owned by EDM
  Consultant FZCO. Already stated in the capability statement.
- **A completion checklist** on the last page. The failure mode for this document
  is being sent half-filled.

## What must NOT be removed

**The turnover figure stays.** `£20.31m delivered across 11 schemes and 4 sectors`
is correct here. Decision 1 removes it from public material and keeps it in this
pack, alongside the accounts that support it. The compliance checker is configured
to allow it in this file and nowhere else.

## The bracketed fields

Every `[ bracketed field ]` renders as a marked, highlighted slot, so a
half-finished pack is obvious rather than going out with brackets nobody noticed.
They are unfilled on purpose — each is a fact only the business holds, and a PQQ
is the worst place to guess at one.

Filling them is a Christopher job, not a Claude job. The outstanding ones are the
legal name, licence and TRN numbers, incorporation date, registered address,
insurances, accreditations, HSE record, workforce numbers, three years of turnover,
bankers and trade references.

## Contact numbers — resolved 22/08/2026

Confirmed by Christopher: **this pack was right, the business cards were wrong.**

- Christopher Simon is **+971 (0) 58 601 2021**.
- Kenny Buchanan is **+971 (0) 58 580 0870** — the number already listed here.

Kenny's business card had been printing Christopher's mobile. Rebuilt.

**Still outstanding: Eddie Duffy's card.** It also carries Christopher's number,
+971 (0) 58 601 2021. This pack lists Eddie as **+44 (0) 7778 877353**. Which
belongs on his card has not been confirmed, so the card is left as-is rather than
guessed at. `tools/compliance-check.py` fails until it is settled.

A contact-consistency check now runs over the cards and this pack together: two
people sharing a number fails the build, and one person appearing with two numbers
raises a warning. Nothing had been comparing them before, which is how a director
came to be handing out a card with someone else's mobile on it.
