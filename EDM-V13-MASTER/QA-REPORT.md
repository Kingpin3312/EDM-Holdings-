# QA REPORT — V12

Assessment run 20 August 2026, after the social media system was added. Not a
review of intentions: every item below was found by testing the artefacts, and
every fix was re-tested afterwards.

**Six defects found. All six fixed. Regression sweep passes 14 of 14.**

---

## DEFECT 1 — The corporate brochure was mis-paginated from page 12 onwards
**Severity: high. Client-facing document.**

When the leadership block replaced the old initials strip, the "Our people" page
overflowed onto a thirteenth page. The footer — including the page number —
rendered on the overflow, so **page 12 carried no page number at all and pages
13 to 17 were each numbered one behind their true position.**

A prospect flicking to "page 14" would land on page 15. In a document sent to
procurement, that is the kind of small wrongness that makes a reader wonder what
else was not checked.

**Fixed:** the page is now split — the workforce argument, then a dedicated
leadership page, matching the capability statement's structure. Renumbered and
verified page by page: printed number equals actual position on all 17.

**Root cause worth noting:** nothing was checking this. Page numbers were being
written by hand in the source and nobody was comparing them to the render. The
regression sweep now does.

---

## DEFECT 2 — Every stated page count was wrong
**Severity: high. Public claim that fails on contact with the file.**

Adding the leadership page made the capability statement 19 pages and the
brochure 17. Four places still said otherwise:

| Location | Said | Actual |
|---|---|---|
| `capability-statement.html` document meta | 17 pages | 19 |
| `capability-statement.html` privacy line | 17 pages | 19 |
| `index.html` and `about.html` cards | seventeen / Sixteen | 19 / 17 |
| `09-Document-Sources/README.md` | 17 / 16 | 19 / 17 |

A visitor is told the download is seventeen pages, opens it, and counts
nineteen. Small, checkable, and exactly the sort of discrepancy that costs
credibility for no benefit.

**Fixed** in all four places and added to the regression sweep, which now reads
the actual PDF and compares.

---

## DEFECT 3 — The standalone social kit did not run
**Severity: high. A deliverable that failed on first use.**

`EDM-Social-Media-Kit.zip` was tested the way a recipient would use it: unzip,
run the generator. It crashed immediately.

The script resolved fonts and the cube mark through relative paths into
`../09-Document-Sources` and `../01-Brand-Identity` — folders that exist inside
the master pack and nowhere else. Handed to a designer or a social agency, the
kit was inert.

**Fixed:** the kit now ships its own copy of the four Montserrat weights and the
cube master. The script looks locally first, falls back to the pack layout, and
if it finds neither it fails with a message that says what it was looking for
rather than a stack trace. Retested from a fresh unzip: renders all 20 templates.

---

## DEFECT 4 — The capability deck was outside every automated check
**Severity: medium. A gap rather than an error.**

`build.sh` verified the four PDFs for client names, turnover, absolutes and
banned wording. The capability deck — a live business-development document that
had to be corrected by hand in V12 because it carried £20.31m, "four markets"
and the word "sublet" — was checked by nobody.

Anything not covered by a check drifts back. This one already had.

**Fixed:** `build.sh` now reads the .pptx slide XML directly and runs the same
four checks. Currently zero on all four.

---

## DEFECT 5 — One leadership photo had no fallback
**Severity: low.**

Three of the four `<img>` tags on the About page carried an `onerror` fallback to
the initials monogram. Kenny's did not — it predated the pattern. If that file
ever went missing, three cards would degrade gracefully and one would show a
broken-image icon.

**Fixed.** All four consistent.

---

## DEFECT 6 — Two CTA variants were documented but never used
**Severity: low, but it is the documentation lying.**

`CTA-SYSTEM.md` listed six variants and said where each one sits. Two of them —
`hiring` and `coffee` — were defined in the script and referenced nowhere.

**Fixed:** a recruitment feed template now uses the hiring CTA, and `coffee` is
commented in the script as belonging to profile Abouts and follow-up messages
rather than rendered artwork. Twenty templates now, not nineteen.

---

## CHECKED AND CLEAN

- No broken internal links or missing assets across all 20 site pages.
- No duplicate element IDs.
- Exactly one footer CTA and one footer blurb per page, 20 of 20.
- All JSON-LD blocks parse.
- Every template referenced in the Instagram content file exists on disk.
- All four PDFs: Montserrat only, every font embedded, no second family.
- No unembedded fonts anywhere in the pack.
- Public-edition checks: zero client names, turnover figures, absolutes or
  banned wording in any client-facing document or the deck.

## ONE THING NOT FIXED, DELIBERATELY

Section 16.4 of the LinkedIn master system says "the website presents four
markets". That was true when the audit was written and is no longer true — the
website was corrected in V12. It is left as written because it is an audit
record of what was found, not a live claim. Rewriting an audit to match the
present makes it useless as a record.

## THE STRUCTURAL LESSON

Five of the six defects were introduced by *this week's* improvements, not by
V11. Adding a page broke the pagination. Adding photographs made the page counts
wrong. Splitting the kit out broke its paths.

That is normal, and it is why the regression sweep matters more than any single
fix. The checks now cover page counts, pagination, links, assets, CTA coverage,
template integrity, font embedding and the deck. Run them after any change:

    sh 09-Document-Sources/build.sh
