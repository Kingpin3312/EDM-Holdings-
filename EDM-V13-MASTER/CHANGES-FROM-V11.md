# V12 — WHAT WAS FIXED, AND WHAT WASN'T

19 August 2026. Applied to a copy of V11; nothing was deleted, superseded files
are in `_ARCHIVE-superseded/`.

---

## FIXED

### 1. Vehicle livery was documenting the wrong palette
**Worse than the audit first suggested.** The render didn't just use `#0E3A2C`
instead of `#083819` — it carried a swatch bar at the foot of the page printing
**"EMERALD · #0E3A2C"** and **"IVORY · #F5F2EA"** as if those were the brand
colours. Hand that file to a signwriter and they'd match to it.

Wrap corrected to `#083819`. Swatch bar rebuilt as EMERALD `#083819` /
WHITE `#FFFFFF` / STEEL `#9AA3A0`. Ivory removed entirely.

### 2. Retired bone removed from three renders
`#F5F2EA` and its variants were 30.2% of the workwear render and 31.9% of the
livery. The workwear render also used `#0E3A2C` for the hard-hat band, vest tag and the "BRAND APPLICATION" eyebrow — all corrected to `#083819`. Both grounds now `#FFFFFF`. Soft shadows kept — the warm cast was neutralised
rather than flattened, so the renders still have depth.

Verified: 0.000% warm-cast pixels remaining in the workwear and wallpaper.
The 0.077% in the livery is the indicator lamp, which is meant to be amber.

### 3. Contact page headline
`contact.html` read "Let's talk about your package." Now reads
**"Send the drawings and the programme."**

The callout further down the same page said "Send us the drawings and the
programme and we'll come back with a straight answer", which would have
repeated the new headline. Reworded to "You'll get a straight answer, not a
brochure."

### 4. Turnover figure
`START-HERE.md` carried £20.31m across 11 schemes. Corrected to the settled
position: £21m+ average annual turnover (AED 90m+), 11 schemes a year, 4
sectors. One figure now in circulation.

### 5. Brand tokens are machine-readable
`01-Brand-Identity/BRAND-TOKENS.md` added. The palette previously existed only
inside a PDF, which is precisely why it drifted. The file also documents
`#0A4A21`, the hover green that was in use on all 20 site pages and in no
guideline.

### 6. LinkedIn assets rebuilt
V11's banner was 1584 × 396 — the personal profile size — so a company page
would have cropped roughly half of it and lost the emerald base rule. Now:
company banner at 1128 × 191 with an @2x, separate CEO and COO personal
banners with content clear of the avatar, and a tighter avatar that reads at
feed size. Built from the master cube artwork and the pack's own Montserrat.

### 7. CLAUDE.md added at root
For Claude Code sessions. Carries the hard rules, the tokens, the voice, the
banned words and the consent gate.

---

## NOT FIXED — and why

### The "100% safety record" claim
It sits in `EDM-Capability-Statement.pdf` and there is no editable source, so
it cannot be changed without rebuilding the document by hand. It also isn't
mine to reword: it needs a definition and a date from you first. Suggested
replacement once you've confirmed the underlying fact: *"No reportable
incidents across EDM sites to date"* with the date stated.

### Four PDFs with unembedded Helvetica
Fixing this needs Ghostscript, which isn't available here, and re-embedding
would alter the rendering anyway. The clean fix is re-export from source. Two
of the four (`EDM-Labour-Productivity-Programme.pdf`,
`EDM-Developer-Engagement-Brief.pdf`) are seen outside the business, so worth
doing.

### DejaVu Sans in the Brand Guidelines PDF
Same reason. No source. It's the ✕ glyphs on the "Getting it wrong" page.

### `#0A4A21` on 20 pages
Documented rather than removed. Every page carries its own inline `<style>`
block — there is no shared stylesheet — so changing one colour means 20 edits
with no visible improvement. **This is the real finding:** with no shared CSS,
any future brand change is a 20-file job and the palette will drift again.
Extracting a shared stylesheet is a good early task for Claude Code.

### The four-market claim
Left alone deliberately. Every public document presents four markets while the
capability statement concedes the delivered record spans three jurisdictions
with live delivery in one. Changing that is a positioning decision, not a
correction, and it needs your call on what may accurately be said about the
Ireland, UK and Australia entities. All new LinkedIn copy is already written to
the safe form.

### "Since 1986" attribution
Same reason. Where the site attributes 1986 to EDM Holdings as a trading entity
rather than to the team and the trade, that's a wording decision across several
pages. Flagged, not changed.

---

## VERIFY BEFORE THIS SHIPS

1. Open the workwear and livery renders and check they still look right to you.
   Automated recolouring is reliable but it is not a designer.
2. Confirm the steel tone. The livery bar says `#9AA3A0`; the logo artwork uses
   `#9EA3A2`. One of them is wrong and I've left both as found.
3. Check the contact page in a browser.

---

## ADDED AFTER THE FIRST PASS

### 8. Steel tone resolved
The livery swatch bar said `#9AA3A0`; the logo said `#9EA3A2`. Checked against
the artwork rather than guessing: both vector sources (`favicon.svg`,
`edm-logo.svg`) and the 1024px cube master use `#9EA3A2`. That is
authoritative. The livery render and its swatch bar now match it.

### 9. Shared stylesheets extracted — the palette can't drift again
This was the underlying cause of every colour finding in the audit. Twenty
pages, each carrying its own inline `<style>` block, meant one hover colour
existed in twenty places and no guideline.

Three stylesheets now:

| File | Pages | Was |
|---|---|---|
| `assets/edm-base.css` | 14 | Identical 10.9KB block repeated 14 times |
| `assets/edm-landing.css` | 4 | Identical 7.6KB block on the SEO landing pages |
| `assets/edm-whatsapp.css` | 20 | Identical WhatsApp float block on every page |

Two pages keep a bespoke block because theirs genuinely differ:
`capability-statement.html` and `where-we-operate.html`.

**How it was verified.** Each `<style>` block was replaced by a `<link>` at the
exact same position, so the cascade order is unchanged. Every page was then
rebuilt by substituting the stylesheet contents back into the link, and
compared byte-for-byte against the original. 38 of 38 reconstruct identically.
No CSS was rewritten, reformatted or "improved" — it is the same bytes, moved.

**The effect.** `#0A4A21` went from 20 files to 4. The WhatsApp greens went
from 20 files to 1. A colour change is now a one-line edit in one file instead
of a twenty-file job.

**Before you publish:** open the site in a browser and click through it. The
verification above proves the CSS is identical, not that a file path resolves
on your host. If anything looks wrong, the pre-refactor site is at
`_ARCHIVE-superseded/edm-site-inline-styles/`.

---

## THE FINDING THAT CHANGED THE PRIORITY ORDER

### 10. The named documents were the public downloads

The V10 changelog records that public editions were generalised — project
naming reduced to "a major UAE data centre" / "Tier-1 main contractor" — and
that named editions were segregated into `13-Go-To-Market/Tender-Editions`.

That folder did not exist in V11. And the capability statement and corporate
brochure sitting in `03-Corporate-Documents` **and in the live website folder,
linked as downloads from edmholdings.ae**, name Khazna Data Centers, the QAJ01
facility and PMK Group — six times in the capability statement and seven in the
brochure.

Consent to name them is verbal only.

So this was not a future risk to manage before the LinkedIn launch. The named
client and project have been publicly downloadable from the website.

**What has been done:**

- All four named files moved to `13-Go-To-Market/Tender-Editions` with a
  distribution warning. Filenames now say what they are.
- A genuinely generalised public capability statement built from a new editable
  source and installed in both public locations. Verified: zero occurrences of
  either name.
- The corporate brochure has no source yet, so it could not be rebuilt. Its
  download link has been replaced on the homepage and About page with
  "Request a copy", pointing at the contact page. Nothing on the site is broken
  and nothing downloadable names a client.

**What you should do:** if the site is already live with those files, they are
in caches, CDNs and possibly search indexes. Replace them at the host, and
assume anyone who downloaded them still has them. Get the written consent —
which makes all of this retrospectively fine — or contact PMK before someone
else does.

### 11. The capability statement now has an editable source

`09-Document-Sources/` holds the HTML source, the brand stylesheet, the four
permitted font weights and a build script. `./build.sh` renders the PDF to both
output locations.

The original PDF was produced by WeasyPrint 69.0 — its metadata says so — which
means a source almost certainly existed and simply was not shipped in the pack.
Worth asking whoever produced V11 for it; if it turns up, reconcile rather than
maintaining two.

The new source applies all five decisions and fixes three defects in the
original:

| | V11 PDF | V12 source |
|---|---|---|
| Client naming | Khazna, QAJ01, PMK named | Generalised |
| Turnover | £21m+ average annual, 11 schemes a year | Removed |
| Safety | "100% safety record" | Removed; controls described instead |
| Markets | "Four markets, one standard" | Delivery UAE, track record behind it |
| 1986 | "Established 1986" on the cover | Attached to the team and the trade |
| Typeface | Montserrat **Medium 500** — not in the brand system | 300 / 400 / 600 / 700 only |
| Second font | — | None. Ticks drawn in CSS, not typed as a glyph. |

Seven pages, layout matched to the original. Only Montserrat is embedded.
