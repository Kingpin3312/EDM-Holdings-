# EDM Holdings — brand, documents and digital estate

Specialist interior fit-out and drywall contractor, Dubai. This repository holds
the whole estate: the brand system, the client-facing documents and their
sources, the website, EDM OS, and the go-to-market and social systems.

**Pack version: V12.** Supersedes V11. Board sign-off 20 August 2026 —
see `_BOARD-SIGN-OFF.md`.

---

## Read these first, in this order

| File | Why |
|---|---|
| `CLAUDE.md` | Project instructions. Claude Code reads this automatically at the start of every session. |
| `_V12-DECISIONS.md` | Five settled positions on what may and may not be claimed. **Overrides anything you find in an older document.** |
| `_BOARD-SIGN-OFF.md` | What is released, what is held, and who owns the outstanding actions. |
| `_V12-QA-REPORT.md` | The six defects found in QA, how they were fixed, and what is now checked automatically. |
| `START-HERE.md` | The original pack orientation note. |
| `CHANGELOG.txt` | Version log. V12 is current. |

---

## The one rule that matters

**No client, project or main contractor may be named in public material until
written consent is filed in `consents/`.**

Consent for Khazna Data Centers, QAJ01 and PMK Group is currently **verbal
only**. Named editions are quarantined in `13-Go-To-Market/Tender-Editions`.
Generalised versions are live everywhere else, and unnamed alternatives are
already written for the two LinkedIn posts that depend on it.

---

## Building the documents

Client-facing PDFs are **output, not source**. Never edit a PDF — edit the HTML
and rebuild.

```sh
pip install weasyprint
sh 09-Document-Sources/build.sh
```

That renders four documents and then checks each one for client names, the
turnover figure, absolute claims and banned wording. Every count must be zero.
It also checks the capability deck and lists embedded fonts — anything other
than Montserrat means a glyph was typed instead of drawn.

| Document | Pages | Source |
|---|---|---|
| Capability statement | 19 | `09-Document-Sources/capability-statement-public.html` |
| Corporate brochure | 17 | `09-Document-Sources/corporate-brochure-public.html` |
| Handover standard | 1 | `09-Document-Sources/handover-standard.html` |
| Brand guidelines | 7 | `09-Document-Sources/brand-guidelines.html` |

## Building the social templates

```sh
python3 22-Social-Media-System/make-templates.py
```

Twenty templates rendered from the brand tokens and the master cube artwork.
Edit the content block at the foot of the script — **never open a PNG and retype
the text.** That is how the workwear and livery renders drifted off-palette
before V12.

---

## Layout

| Folder | Contents |
|---|---|
| `01-Brand-Identity` | Logo masters, brand guidelines, `BRAND-TOKENS.md` |
| `02-Website` | The 20-page edmholdings.ae site |
| `03-Corporate-Documents` | Built PDFs — capability statement, brochure, handover standard |
| `04`, `06`, `09-Stationery-Sources` | Stationery and templates |
| `05-Brand-Applications` | Workwear, livery and wallpaper renders (illustrative) |
| `07-Social-Media` | Profile and banner assets |
| `09-Document-Sources` | **HTML sources + `build.sh`. The documents are built from here.** |
| `10-Capability-Deck` | The .pptx deck. No source — corrected in place, checked by `build.sh`. |
| `11-EDM-OS` | The construction CRM and operations platform |
| `13-Go-To-Market` | LinkedIn system, outreach kit, lead playbook, tender editions |
| `14`–`18` | EDM Measure, Evidence, Progress, Daybook, Cashflow |
| `22-Social-Media-System` | Playbook, CTA system, Instagram content, template generator |
| `consents/` | Written client consents. Empty means nothing may be named. |
| `_ARCHIVE-superseded/` | Superseded assets. Read-only — kept deliberately. |

---

## Before you commit anything

- `.env` is ignored. `.env.example` is committed on purpose — keep placeholder
  values in it.
- The website contains a **public Web3Forms access key** in `contact.html` and
  `capability-statement.html`. Web3Forms keys are designed to sit in client-side
  code, so this is not a credential leak — but **if this repository is public,
  rotate the key** at web3forms.com, because anyone can read it and submit
  through your form.
- The Anthropic key for the chatbot relay is read from `process.env` and is not
  in the repository. Keep it that way.

---

## Outstanding actions

1. Written consent from PMK Group / Khazna. Deadline that matters: **7 October**,
   when LinkedIn Post 08 is scheduled.
2. File the trade licence copy in the PQQ pack. Scope confirmed 20/08/2026; the
   attachment is what an auditor asks for.
3. Half-day leadership photography — four portraits from four different shoots.
4. Site photography, per the brief in `09-Document-Sources`.
5. Name a site capture owner: fifteen minutes weekly. Without it the social
   programme runs out of material in week five.
