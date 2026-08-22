#!/usr/bin/env python3
"""
Detect content colliding with the page footer in a built EDM document.

The document CSS gives .page a fixed height with overflow:hidden and pins .foot
absolutely near the bottom. Content that runs long therefore does one of two
things, neither of them visible in the HTML: it slides underneath the footer and
overprints it, or it is clipped away entirely and silently disappears from the
PDF. Both happened while building the PQQ pack.

    python3 tools/check-page-overflow.py <file.pdf> [more.pdf ...]

Exit 1 if any page has a body text block overlapping its footer band.
"""
import sys
import pymupdf

def check(path: str) -> int:
    doc = pymupdf.open(path)
    problems = []
    for i, page in enumerate(doc, 1):
        blocks = [b for b in page.get_text("blocks") if b[4].strip()]
        if not blocks:
            continue
        # The footer is the lowest block on the page. Anything else sitting in
        # the same horizontal band is part of the same footer lockup (a page
        # number opposite a label, a two-span cover band), not an overflow — so
        # a collision has to overlap on BOTH axes to count.
        footer = max(blocks, key=lambda b: b[3])
        ftop, fx0, fx1 = footer[1], footer[0], footer[2]
        for b in blocks:
            if b is footer:
                continue
            vertical = b[3] > ftop + 1
            horizontal = b[0] < fx1 - 1 and b[2] > fx0 + 1
            if vertical and horizontal:
                txt = " ".join(b[4].split())[:70]
                problems.append((i, round(b[3] - ftop, 1), txt))
    name = path.rsplit("/", 1)[-1]
    if problems:
        print(f"  FAIL  {name} — {len(problems)} block(s) overlapping the footer")
        for pg, overlap, txt in problems:
            print(f"          page {pg}: {overlap}pt into the footer — “{txt}…”")
        return 1
    print(f"  ok    {name} — {len(doc)} pages, no footer collisions")
    return 0

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        raise SystemExit(2)
    raise SystemExit(max(check(p) for p in sys.argv[1:]))
