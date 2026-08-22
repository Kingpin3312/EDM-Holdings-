# EDM Holdings — Complete Delivery

**Pack: EDM-V13-MASTER. Supersedes EDM-V12-MASTER.**

**Read `DECISIONS.md` before changing any client-facing wording.** It
settles five positions — the licensed-scope mismatch, the turnover figure, the
safety claim, market wording and the 1986 attribution — and those decisions
override anything you find in an older document.

`CHANGES-FROM-V11.md` lists what changed from V11 and what was deliberately left
alone. `EDM-V11-Asset-Audit-as-received.md` is the full file-by-file audit that produced it.

Client-facing PDFs are no longer hand-built. Edit the HTML in
`09-Document-Sources` and run `./build.sh`, which renders the capability
statement, corporate brochure, handover standard and brand guidelines, then
checks each for client names, turnover figures, absolutes and banned wording.

**Implementing? Open `IMPLEMENTATION-ORDERS.pdf` first — seven jobs in order, with a proof-of-done test for each. Nothing gets changed, only deployed.**

The full brand and digital programme in one place. This note tells you what's
finished and on-brand, and the few items that are internal or still need real
photography. Read it first.

---

## The brand system (locked)

- **Background:** pure white `#FFFFFF`
- **Accent:** emerald green `#083819` — the only accent
- **Neutrals:** `#0F231B` ink, `#5C6F66` muted text, `#E4E6E0` rules
- **Typeface:** Montserrat — self-hosted on the website and EDM OS, embedded in
  every PDF and the deck. No internet needed for it to render correctly.
- **Logo:** the three-tone cube with the grey side panel (`#7C8282` and
  `#9EA3A2`), plus the EDM HOLDINGS wordmark and "Fit-Out & Drywall Specialists"
  line. The panel greys are part of the mark — never recolour them.

---

## Ready to use — built on the locked system

| Folder | What's inside |
|--------|---------------|
| `01-Brand-Identity` | The cube logo, every variant and favicon, plus the **Brand Guidelines** PDF. Includes the drawn illustration suite (`Illustration/`) — original drawn artwork used on the share image and capability cover until real photography lands. |
| `02-Website` | The full 20-page site. White + emerald, grey-panel logo, Montserrat self-hosted. Opens and renders offline. |
| `03-Corporate-Documents` | **Capability Statement** and **Corporate Brochure** — rebuilt, embedded font, on palette. |
| `04-Stationery` | Four personalised business cards, letterhead, comp slip, invoice, quotation, envelope, continuation sheet, receipt, purchase order, and the email signature. |
| `06-Templates` | **Project Profile** and **Tender Cover** — fill-in templates for bids. |
| `07-Social-Media` | LinkedIn banner and profile, share/OG card, three post templates, email header. |
| `08-Site-Signage` | Hoarding, site information board, PPE safety sign. |
| `09-Stationery-Sources` | Editable HTML behind all the stationery. |
| `10-Capability-Deck` | The BD pitch deck (PowerPoint), Montserrat embedded. |
| `11-EDM-OS` | Full application source. Source-complete; not yet run with live data. `node_modules` removed — see its README. |
| `12-Logo-Masters` | High-res logo masters and favicon set. |
| `13-Go-To-Market` | The commercial engine room: go-live checklist, PQQ information pack, launch posts, a 90-day content bank (a post a week in the house voice), the outreach kit — first touch, follow-up, tender cover note, the after-decision notes win or lose — and the lead playbook: the hunting list by market, the strike triggers, the qualification test, the fifteen-minute call, and the weekly numbers. |
| `14-EDM-Measure` | The drywall takeoff tool: open a drawing, calibrate, trace — the trace lands in a live priced bill. Open index.html in a browser; see its README. |
| `15-EDM-Evidence` | Per-wall QA and fire-stopping records with photo evidence, importing straight from EDM Measure. Prints the branded handover pack. The client-facing explainer is `03-Corporate-Documents/EDM-Handover-Standard.pdf`. |
| `16-EDM-Progress` | The project director's board: plan by zone, actuals filled in from the evidence records, two-week lookahead, dated delay log, and a one-minute branded weekly report. |
| `17-EDM-Daybook` | The site manager's daily record: labour, weather, deliveries, snags, and every verbal instruction logged with time, name and photo. Prints the branded daily sheet. EDM Measure now also prints a wall reference plan for the cabin. |
| `18-EDM-Cashflow` | The CFO's board: applications versus certificates with every shortfall reasoned, retention release dates that shout when they pass, aged certified-unpaid as the client early warning, and a one-page monthly cash report. |
| `19-EDM-Board` | The COO's Monday screen: loads the teams' saved files, matches them by project name, and rolls the whole group onto one board — completion, lateness, labour, money and an attention list — with a printable weekly operations summary. |
| `20-Training` | The training manual: twelve modules covering every tool and habit, a who-takes-what matrix, and a competence sign-off for each — nobody is trained because they attended, only because they can do it on a live file. |
| `21-Chatbot` | The website's front desk: a working enquiry assistant scoped to Dubai and the UAE — qualifies like the lead playbook, never quotes prices, never invents facts, and hands serious enquiries to the team for a call or a coffee. |

Everything above shares one identity, one palette and one font — consistent
end to end.

---

## The short honest list

- `05-Brand-Applications` — the **workwear and vehicle-livery mockups** are
  illustrative renders and should be refreshed before real production; the
  iPhone wallpaper is a correct reference. Nothing here is a client hand-out.
- `EDM-Decisions.pdf` at the root is the short list: the six decisions only
  the business can make, each with an owner and date line. When that page is
  full, the project is running, not just delivered.
- `EDM-Technology-Runbook.pdf` at the root is the one-page operating rules
  for the digital side — custody, backups, naming, the EDM OS pilot and the
  security basics. Give it an owner and review it every six months.
- Root PDFs (`Board-Review`, `Pre-Launch-Audit`, `Project-Showcase`) and the
  `Photography-Case-Study-Brief` are **internal working documents**.
  `Project-Showcase` in particular needs real site photography — use the Project
  Profile template until then.
- **EDM OS** is finished as source but hasn't been run end-to-end with live
  data. That's the one remaining build step, and it's expected.

---

## Not included

The two earlier website folders are retired and left out, so only the approved
identity ships. No turnover figure appears in any public document. The two versions previously in
circulation could not be reconciled, so the figure now lives only in the PQQ pack
alongside the accounts that support it. See DECISIONS.md, Decision 1. What is
stated publicly: 11 delivered schemes across 4 sectors, behind a team that has
worked in this trade since 1986, with live delivery in the UAE.
