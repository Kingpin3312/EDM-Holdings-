#!/bin/sh
# EDM HOLDINGS — DOCUMENT BUILD
# Requires: pip install weasyprint
#
# Renders the editable HTML sources to PDF with Montserrat embedded.
# Always run this rather than editing a PDF. The PDF is output, not source.

set -e
cd "$(dirname "$0")"

weasyprint capability-statement-public.html ../03-Corporate-Documents/EDM-Capability-Statement.pdf
cp ../03-Corporate-Documents/EDM-Capability-Statement.pdf ../02-Website/edm-site/EDM-Holdings-Capability-Statement.pdf

weasyprint corporate-brochure-public.html ../03-Corporate-Documents/EDM-Corporate-Brochure.pdf
cp ../03-Corporate-Documents/EDM-Corporate-Brochure.pdf ../02-Website/edm-site/EDM-Holdings-Corporate-Brochure.pdf

weasyprint handover-standard.html ../03-Corporate-Documents/EDM-Handover-Standard.pdf

weasyprint brand-guidelines.html ../01-Brand-Identity/Brand-Guidelines.pdf

echo
echo "Built. Only Montserrat should be listed below — a second family means a"
echo "glyph was typed instead of drawn. See README.md."
pdffonts ../03-Corporate-Documents/EDM-Capability-Statement.pdf
pdffonts ../03-Corporate-Documents/EDM-Corporate-Brochure.pdf

echo
echo "Public-edition check — every count below must be 0:"
for f in ../03-Corporate-Documents/EDM-Capability-Statement.pdf \
         ../03-Corporate-Documents/EDM-Corporate-Brochure.pdf \
         ../03-Corporate-Documents/EDM-Handover-Standard.pdf; do
  echo "  $f"
  echo "    client names   : $(pdftotext "$f" - | grep -ci 'khazna\|PMK Group')"
  echo "    turnover       : $(pdftotext "$f" - | grep -c '21m\|20.31\|AED 90m')"
  echo "    absolutes      : $(pdftotext "$f" - | grep -c '100%')"
  echo "    banned wording : $(pdftotext "$f" - | grep -ci 'sublet\|sub-let\|talk about your package\|thrilled\|four markets')"
done

# The capability deck is a .pptx with no source, so it is checked separately —
# it was corrected by hand in V12 and nothing stops it drifting again.
echo
echo "Capability deck (.pptx) — every count must be 0:"
python3 - <<'PYCHK'
import zipfile, re, os
p = "../10-Capability-Deck/EDM-Holdings-Capability-Deck.pptx"
if not os.path.exists(p):
    print("    deck not found — skipped"); raise SystemExit
z = zipfile.ZipFile(p)
t = "".join("".join(re.findall(r"<a:t>([^<]*)</a:t>", z.read(n).decode("utf8", "ignore")))
            for n in z.namelist() if n.startswith("ppt/slides/slide") and n.endswith(".xml"))
low = t.lower()
checks = {
    "client names  ": ["khazna", "pmk group"],
    "turnover      ": ["21m", "20.31", "aed 90m"],
    "absolutes     ": ["100%"],
    "banned wording": ["sublet", "sub-let", "talk about your package", "four markets", "thrilled"],
}
for label, terms in checks.items():
    print(f"    {label}: {sum(low.count(x) for x in terms)}")
PYCHK

echo
echo "  ../01-Brand-Identity/Brand-Guidelines.pdf"
echo "    client names   : $(pdftotext ../01-Brand-Identity/Brand-Guidelines.pdf - | grep -ci 'khazna\|PMK Group')"
echo "    turnover       : $(pdftotext ../01-Brand-Identity/Brand-Guidelines.pdf - | grep -c '21m\|20.31\|AED 90m')"
echo "    (absolutes and banned wording are not checked here — the guidelines"
echo "     quote them on purpose, as the list of things not to write.)"
