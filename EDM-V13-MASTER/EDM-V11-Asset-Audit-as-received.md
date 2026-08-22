# EDM-V11-MASTER — ASSET AUDIT

**Checked:** 19 August 2026 · 471 files · every PDF, PNG, SVG, HTML, CSS and the capability deck
**Method:** file integrity, PDF font embedding, pixel-level colour analysis against the locked palette, CSS hex extraction, PowerPoint font embedding

---

## Summary

The pack is in good order. No corrupt, empty or unreadable files. Every PDF opens. The website source is clean against the locked palette. The logo SVGs contain only approved colours.

Seven findings below. Two are worth acting on before anything else goes out.

---

## FINDING 1 — The retired bone palette is still the dominant colour in two brand-application files
**Severity: high · Files: `05-Brand-Applications/EDM-Site-Workwear.png`, `EDM-Vehicle-Livery.png`**

Exact pixel counts:

| File | `#F5F2EA` (retired bone) | Other bone tints |
|---|---|---|
| EDM-Site-Workwear.png | **30.2%** of the image | `#F4F1E9` 1.9%, `#F2EFE7` 1.0% |
| EDM-Vehicle-Livery.png | **31.9%** of the image | `#F4F1E9` 2.2% |

`#F5F2EA` is one of the tints recorded as removed from every asset. It survives here as the background ground of both mockups.

`START-HERE.md` already flags this folder as illustrative renders to be refreshed before production, and there is a `_MOCKUPS-refresh-before-production.txt` note in the folder. So it is a known issue. The specific risk is that these are the two files most likely to be handed to a signwriter or a workwear supplier as a reference, and doing so would reintroduce the retired palette into physical production.

**Action:** rebuild both on white before any supplier sees them, or rename the files so they cannot be sent by mistake.

**Not a finding:** the lime `#D7E021` in the workwear image is hi-vis. That is a regulated safety colour, not a brand colour, and it is correct.

---

## FINDING 2 — Off-system green in the vehicle livery
**Severity: high · File: `05-Brand-Applications/EDM-Vehicle-Livery.png`**

The livery green measures `#0E3A2C`, not `#083819`. Close enough to look right on screen and wrong on a vehicle wrap, where the colour gets matched from the supplied file.

Same class of failure as the recreated-mark and off-system-green issues already flagged in design review. Worth checking that the source file behind this render is corrected, not just the render.

---

## FINDING 3 — Four PDFs contain unembedded Helvetica
**Severity: medium**

| File | Issue |
|---|---|
| `00-Board-Documents/EDM-Labour-Productivity-Programme.pdf` | Helvetica, Type 1, not embedded |
| `00-Developer-Onboarding/EDM-Developer-Engagement-Brief.pdf` | Helvetica, Type 1, not embedded |
| `00-Developer-Onboarding/EDM-OS-Commercial-Engine-Spec.pdf` | Helvetica, Type 1, not embedded |
| `04-Stationery/Email-Signature/EDM-Email-Signature-Install-Guide.pdf` | Helvetica, Type 1, not embedded |

An unembedded font is substituted by whatever the reader's machine has. The Labour Productivity Programme is a board document and the Developer Engagement Brief goes to third parties, so both are seen outside the business.

The Montserrat subsets in these same files **are** embedded correctly. It is only the Helvetica fallback that is loose, which points at a single default text element in the export template rather than four separate mistakes.

**Action:** re-export with all fonts embedded.

---

## FINDING 4 — The Brand Guidelines PDF breaks its own single-typeface rule
**Severity: low, but it is the brand document**

`01-Brand-Identity/Brand-Guidelines.pdf` embeds `DejaVu-Sans-Bold` alongside the three Montserrat weights. Almost certainly the ✕ glyphs on the "Getting it wrong" page, which the Montserrat subset does not carry.

The same substitution appears in `20-Training/EDM-Training-Manual.pdf` and `02-Website/Go-Live-Guide.pdf` — the latter also uses DejaVu Sans Mono for code blocks, which is reasonable.

Nobody will notice. But the document that says "don't introduce a second font" contains a second font, and if it is ever read closely that is an awkward thirty seconds. Replace the crosses with a drawn shape or a Montserrat capital X.

---

## FINDING 5 — An undocumented green in the website CSS
**Severity: low**

Every hex value across the 20-page site, counted:

| Colour | Uses | Status |
|---|---|---|
| `#5C6F66` | 154 | Approved — muted |
| `#083819` | 144 | Approved — emerald |
| `#E4E6E0` | 38 | Approved — hairline |
| `#FFFFFF` | 20 | Approved — ground |
| `#0F231B` | 20 | Approved — ink |
| `#9EA3A2` / `#7C8282` | 2 each | Approved — cube greys |
| `#25D366` / `#1EBE5B` | 20 each | WhatsApp brand green. Correct on a WhatsApp button. |
| **`#0A4A21`** | **20** | **Not in the locked palette.** A lighter emerald, used as a hover or secondary state. |

`#0A4A21` is in active use twenty times and is documented nowhere. Either add it to the guidelines as the official interaction state, or replace it. An undocumented token in the CSS is how a palette drifts.

No bone, ivory or sage tints anywhere in the site source. That claim holds.

---

## FINDING 6 — Font naming artefact
**Severity: cosmetic**

The embedded subsets in the four Helvetica files are named `MontserratThin-SemiBold`, `MontserratThin-Regular` and `MontserratThin-Bold`. The glyphs render correctly; the family name in the source font file is simply wrong. Harmless, but Thin is not a weight in the system at all, and it will confuse anyone inspecting the file.

---

## FINDING 7 — LinkedIn assets were built to the wrong specification
**Severity: high · Now fixed, replacements in `03-Assets`**

`07-Social-Media/EDM-LinkedIn-Banner.png` is 1584 × 396, which is the personal profile size. A company page cover renders at 1128 × 191, so roughly half the height would be cropped and the emerald base rule lost entirely.

On a personal profile the same file has a different problem: the logo lockup sits lower-left, exactly where the circular avatar lands.

`EDM-LinkedIn-Profile.png` (400 × 400) is correctly built — cube alone, per the minimum-size rule — but carries enough white padding that the mark looks undersized at the 48–60px LinkedIn renders in a feed.

---

## What passed with no issues

- **File integrity.** 471 files, no zero-byte files, no unreadable images, all 38 PDFs open cleanly.
- **Logo SVGs.** `favicon.svg` and `edm-logo.svg` contain only `#083819`, `#7C8282` and `#9EA3A2`. Correct, and the cube greys are intact.
- **Capability deck.** 11 slides, Montserrat Regular and Bold both embedded, and both are the weights actually used on the slides. It will render correctly on a client's laptop.
- **Stationery.** All fonts embedded across letterhead, invoice, quotation, receipt, purchase order, comp slip, envelope, continuation sheet and all four business cards.
- **Capability statement and corporate brochure.** Both copies, both locations, all fonts embedded.
- **Company stamp.** Clean file, no colour issues.
- **Contact details.** `enquiries@edmholdings.ae` and `+971 (0) 58 601 2021` identical everywhere they appear.
