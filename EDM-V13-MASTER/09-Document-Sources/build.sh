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

# The PQQ pack gained a source on 22/08/2026. It is internal — it carries the
# turnover figure Decision 1 keeps out of public material — but it is built the
# same way as everything else so it cannot drift by hand.
weasyprint pqq-information-pack.html ../13-Go-To-Market/EDM-PQQ-Information-Pack.pdf

echo
echo "================================================================"
echo " Built. Now checking. Nothing below should say FAIL."
echo "================================================================"

# Requires: pip install weasyprint pypdf pymupdf
# (pdffonts/pdftotext are NOT needed any more — they were undeclared, and with
#  set -e a machine without poppler aborted here having written every PDF and
#  checked none of them.)

echo
echo "-- Fonts, page counts and embedding ----------------------------"
python3 - <<'PYFONTS'
import glob, re
from pypdf import PdfReader
DOCS = ["../03-Corporate-Documents/EDM-Capability-Statement.pdf",
        "../03-Corporate-Documents/EDM-Corporate-Brochure.pdf",
        "../03-Corporate-Documents/EDM-Handover-Standard.pdf",
        "../01-Brand-Identity/Brand-Guidelines.pdf",
        "../13-Go-To-Market/EDM-PQQ-Information-Pack.pdf"]
bad = 0
for d in DOCS:
    r = PdfReader(d); fonts = set(); unembedded = []
    for pg in r.pages:
        res = pg.get("/Resources"); res = res.get_object() if res else {}
        fd = res.get("/Font")
        if not fd: continue
        for _, v in fd.get_object().items():
            f = v.get_object()
            base = re.sub(r"^[A-Z]{6}\+", "", str(f.get("/BaseFont", "?")).lstrip("/"))
            fonts.add(base)
            desc = f.get("/FontDescriptor")
            if f.get("/DescendantFonts"):
                try: desc = f["/DescendantFonts"].get_object()[0].get_object().get("/FontDescriptor")
                except Exception: desc = None
            if desc and not any(k in desc.get_object() for k in ("/FontFile","/FontFile2","/FontFile3")):
                unembedded.append(base)
    others = [f for f in fonts if "montserrat" not in f.lower() and f != "?"]
    flag = "FAIL" if (others or unembedded) else "ok  "
    if others or unembedded: bad += 1
    print(f"  {flag}  {d.split('/')[-1]:<34} {len(r.pages):>2}pp  {sorted(fonts)}"
          + (f"  SECOND FAMILY: {others}" if others else "")
          + (f"  NOT EMBEDDED: {unembedded}" if unembedded else ""))
raise SystemExit(1 if bad else 0)
PYFONTS
[ $? -ne 0 ] && FAILED=1

echo
echo "-- Content colliding with the footer ---------------------------"
python3 ../../tools/check-page-overflow.py \
  ../03-Corporate-Documents/EDM-Capability-Statement.pdf \
  ../03-Corporate-Documents/EDM-Corporate-Brochure.pdf \
  ../03-Corporate-Documents/EDM-Handover-Standard.pdf \
  ../01-Brand-Identity/Brand-Guidelines.pdf \
  ../13-Go-To-Market/EDM-PQQ-Information-Pack.pdf || FAILED=1

echo
echo "-- Claims, banned wording and brand tokens, whole estate -------"
python3 ../../tools/compliance-check.py || FAILED=1

# The capability deck is a .pptx with no source, so it is checked separately.
echo
echo "-- Capability deck (.pptx) — every count must be 0 -------------"
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
    "client names  ": ["khazna", "pmk group", "jll", "gilbert-ash", "john sisk", "mclaughlin", "farrans"],
    "turnover      ": ["21m", "20.31", "aed 90m"],
    "absolutes     ": ["100%", "guaranteed", "world-class", "leading", "premier"],
    "banned wording": ["sublet", "sub-let", "talk about your package", "four markets", "thrilled",
                       "robust", "seamless", "leverage", "delve", "elevate"],
}
bad = 0
for label, terms in checks.items():
    n = sum(low.count(x) for x in terms)
    bad += n
    print(f"    {'FAIL' if n else 'ok  '}  {label}: {n}")
raise SystemExit(1 if bad else 0)
PYCHK
[ $? -ne 0 ] && FAILED=1

echo
if [ -n "$FAILED" ]; then
  echo "================================================================"
  echo " SOMETHING FAILED ABOVE. Do not issue these documents."
  echo "================================================================"
  exit 1
fi
echo "================================================================"
echo " All checks passed."
echo "================================================================"
