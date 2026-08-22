#!/usr/bin/env python3
"""
EDM Holdings — brand and claim compliance check.

Enforces the Hard Rules in CLAUDE.md and the five positions in DECISIONS.md
across the website and every client-facing document.

This replaces the checks embedded in 09-Document-Sources/build.sh, which:
  - covered 4 of 49 PDFs and none of the website,
  - grepped 5 of the 22 banned words and 1 of the 7 absolutes,
  - printed counts but always exited 0, so nothing ever failed a build,
  - and needed poppler-utils, which its README never declared.

Exit code 1 on any violation, so CI can hold the line.

    python3 tools/compliance-check.py            # everything
    python3 tools/compliance-check.py --web      # website only
"""
from __future__ import annotations
import re, sys, glob, os, json, argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACK = os.path.join(ROOT, "EDM-V13-MASTER")
SITE = os.path.join(PACK, "02-Website", "edm-site")

# ---------------------------------------------------------------- the rules --

# "chief" is banned as an informal address ("thanks chief"), not as a job title,
# so it is matched only where it is NOT part of an officer title.
BANNED_RE = [r"\bchief\b(?!\s+(?:executive|operating|financial|commercial|technical|officer))"]
BANNED = [
    "bro", "top notch", "gotcha", "sub-let", "sub-listing", "sublet",
    "let's talk about your package", "thrilled", "excited to announce",
    "delighted to share", "proud to announce", "delve", "leverage", "robust",
    "seamless", "elevate", "game-changer", "unlock", "testament",
    "in today's fast-paced", "reach out", "circle back",
]
ABSOLUTES = ["100%", "guaranteed", "zero defects", "world-class", "world class",
             "leading", "premier"]
CLIENTS = ["khazna", "qaj01", "pmk group", "gilbert-ash", "john sisk",
           "mclaughlin & harvey", "jll"]
TURNOVER = [r"£\s?\d+(?:\.\d+)?\s?m", r"aed\s?\d{2,}\s?m(?:illion)?",
            r"20\.31", r"21m\+?", r"annual turnover"]
# Decision 3 permits the four countries as the TEAM'S track record and forbids
# them as EDM's delivery footprint. The distinction is the framing immediately
# before the list, so the check looks for a delivery verb rather than the list.
FOUR_MARKETS = [
    r"four markets",
    r"(?:deliver\w*|self-deliver\w*|operat\w*|mobilis\w*|work\w*|contractor)s?\b[^.]{0,60}?"
    r"\buae\s*[·,]?\s*(?:and\s+)?ireland[^.]{0,40}?australia",
    r"uae\s*·\s*ireland\s*·\s*uk\s*·\s*australia",
    r"dubai,\s*london,\s*ireland",
]
# Wording that legitimately attributes the four countries to the team's history.
TEAM_HISTORY = re.compile(
    r"(?:team|people|experience|track record|heritage|worked|built)\b[^.]{0,80}?"
    r"(?:ireland|australia)", re.I)
ENTITY_1986 = [r"edm (?:holdings )?(?:has )?(?:traded|trading) since 1986",
               r"established 1986", r"1986\s*established"]

# Brand tokens — the only permitted values (CLAUDE.md).
ALLOWED_COLOURS = {
    "#FFFFFF", "#083819", "#0F231B", "#5C6F66", "#E4E6E0",
    "#7C8282", "#9EA3A2",              # logo artwork only
    "#25D366", "#1EBE5B",              # agreed WhatsApp exception
}
RETIRED_COLOURS = {"#F5F2EA", "#F4F1E9", "#F2EFE7", "#0E3A2C"}
ALLOWED_WEIGHTS = {"300", "400", "600", "700"}

# Documents whose job is to QUOTE the rules, so hits in them are correct.
QUOTING = ("brand-guidelines", "Brand-Guidelines", "BRAND-TOKENS",
           "compliance-check", "DECISIONS", "CLAUDE", "QA-REPORT",
           "TECHNICAL-AUDIT", "CHANGES-FROM", "_DISTRIBUTION-WARNING",
           "consents", "CHANGELOG")
# The PQQ pack is where the turnover figure is SUPPOSED to live (Decision 1).
TURNOVER_ALLOWED = ("EDM-PQQ-Information-Pack",)

fails: list[str] = []
warns: list[str] = []


def is_quoting(path: str) -> bool:
    return any(q in path for q in QUOTING)


def rel(p: str) -> str:
    return os.path.relpath(p, ROOT)


def scan_text(path: str, text: str, *, public: bool) -> None:
    """Apply the claim rules to one document's plain text."""
    low = re.sub(r"\s+", " ", text).lower()

    def hits(patterns, regex=True):
        out = []
        for pat in patterns:
            p = pat if regex else r"\b" + re.escape(pat) + r"\b"
            for m in re.finditer(p, low, re.I):
                out.append(low[max(0, m.start() - 55): m.end() + 55])
        return out

    if not is_quoting(path):
        for ctx in hits(CLIENTS, regex=False):
            fails.append(f"{rel(path)}: client named without filed consent — …{ctx.strip()}…")
        for ctx in hits(ABSOLUTES, regex=False):
            fails.append(f"{rel(path)}: absolute claim (Hard Rule 5) — …{ctx.strip()}…")
        for ctx in hits(BANNED, regex=False) + hits(BANNED_RE):
            fails.append(f"{rel(path)}: banned wording — …{ctx.strip()}…")
        for ctx in hits(FOUR_MARKETS):
            if TEAM_HISTORY.search(ctx):
                continue   # the team's track record, which Decision 3 allows
            fails.append(f"{rel(path)}: delivery claimed outside the UAE (Decision 3) — …{ctx.strip()}…")
        for ctx in hits(ENTITY_1986):
            fails.append(f"{rel(path)}: 1986 attached to the entity (Decision 4) — …{ctx.strip()}…")
        if not any(a in path for a in TURNOVER_ALLOWED):
            for ctx in hits(TURNOVER):
                fails.append(f"{rel(path)}: turnover figure in public material (Decision 1) — …{ctx.strip()}…")


def check_website() -> None:
    pages = sorted(glob.glob(os.path.join(SITE, "*.html")))
    if not pages:
        fails.append("no website pages found — has the pack moved?")
        return
    for p in pages:
        raw = open(p, encoding="utf-8").read()
        # Strip scripts, styles and embedded data URIs: base64 payloads are not
        # prose and will match almost any short pattern by chance.
        prose = re.sub(r"<script.*?</script>|<style.*?</style>", " ", raw, flags=re.S)
        prose = re.sub(r"data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]+", " ", prose)
        scan_text(p, prose, public=True)

        if not re.search(r'<html[^>]*lang="en-GB"', raw):
            fails.append(f"{rel(p)}: lang must be en-GB (the estate is UK English)")
        if "foundingDate" in raw:
            fails.append(f"{rel(p)}: foundingDate must not appear (Decision 4)")

        desc = re.search(r'<meta name="description" content="([^"]*)"', raw)
        if desc and len(desc.group(1)) > 160:
            warns.append(f"{rel(p)}: meta description {len(desc.group(1))} chars — will truncate")
        title = re.search(r"<title>(.*?)</title>", raw, re.S)
        if title and len(title.group(1).strip()) > 60:
            warns.append(f"{rel(p)}: title {len(title.group(1).strip())} chars — will truncate")

        for block in re.findall(r"<style[^>]*>(.*?)</style>", raw, re.S) + re.findall(r'\sstyle="([^"]*)"', raw):
            check_css(p, block)

    for css in sorted(glob.glob(os.path.join(SITE, "assets", "*.css"))):
        check_css(css, open(css, encoding="utf-8").read())


def check_css(path: str, css: str) -> None:
    for col in set(c.upper() for c in re.findall(r"#[0-9A-Fa-f]{6}\b", css)):
        if col in RETIRED_COLOURS:
            fails.append(f"{rel(path)}: retired colour {col} has reappeared")
        elif col not in ALLOWED_COLOURS:
            fails.append(f"{rel(path)}: {col} is not a brand token")
    for w in set(re.findall(r"font-weight:\s*(\d{3})", css)):
        if w not in ALLOWED_WEIGHTS:
            fails.append(f"{rel(path)}: font-weight {w} is not in the four-weight system")
    if re.search(r"font-style:\s*italic", css) or "montserrat-400i" in css:
        fails.append(f"{rel(path)}: an italic face is not in the type system")


def check_documents() -> None:
    try:
        from pypdf import PdfReader
    except ImportError:
        warns.append("pypdf not installed — PDF checks skipped (pip install pypdf)")
        return
    for pdf in sorted(glob.glob(os.path.join(PACK, "**", "*.pdf"), recursive=True)):
        if "_ARCHIVE" in pdf:          # deliberately kept, never issued
            continue
        try:
            r = PdfReader(pdf)
            text = "\n".join((pg.extract_text() or "") for pg in r.pages)
        except Exception as e:
            warns.append(f"{rel(pdf)}: unreadable ({e})")
            continue
        scan_text(pdf, text, public=True)

        fonts = set()
        for page in r.pages:
            res = (page.get("/Resources") or {})
            res = res.get_object() if hasattr(res, "get_object") else res
            for _, v in (res.get("/Font") or {}).get_object().items() if res.get("/Font") else []:
                fonts.add(str(v.get_object().get("/BaseFont", "?")).lstrip("/"))
        for f in fonts:
            base = re.sub(r"^[A-Z]{6}\+", "", f)
            if base != "?" and "montserrat" not in base.lower():
                fails.append(f"{rel(pdf)}: second font family embedded — {base}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--web", action="store_true", help="website only")
    ap.add_argument("--docs", action="store_true", help="documents only")
    a = ap.parse_args()
    if a.web or not a.docs:
        check_website()
    if a.docs or not a.web:
        check_documents()

    for w in warns:
        print(f"  warn  {w}")
    for f in fails:
        print(f"  FAIL  {f}")
    print()
    if fails:
        print(f"{len(fails)} violation(s), {len(warns)} warning(s).")
        return 1
    print(f"Compliance clean. {len(warns)} warning(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
