#!/usr/bin/env python3
"""
EDM HOLDINGS — SOCIAL TEMPLATE GENERATOR

Renders every social template from the brand tokens and the master logo
artwork. Nothing is hand-drawn in an image editor, so a template cannot drift
from the brand the way the workwear and livery renders did.

    python3 make-templates.py

Outputs to ./templates/. Edit the CONTENT blocks at the bottom to re-render
with different copy — that is the intended workflow. Do not open the PNGs in an
editor and retype the text.

Requires: Pillow. Fonts and the cube mark are read from ../09-Document-Sources.
"""

from PIL import Image, ImageDraw, ImageFont
import os, textwrap

# ---------------------------------------------------------------- brand tokens
GROUND   = (255, 255, 255)
EMERALD  = (8, 56, 25)
INK      = (15, 35, 27)
MUTED    = (92, 111, 102)
HAIRLINE = (228, 230, 224)

HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(HERE, "templates")
os.makedirs(OUT, exist_ok=True)

def _first_existing(*paths):
    for p in paths:
        if os.path.exists(p):
            return p
    raise SystemExit(
        "Could not find brand assets. Expected them in ./assets/ (standalone kit)\n"
        "or in ../09-Document-Sources and ../01-Brand-Identity (inside the master pack).\n"
        "Tried:\n  " + "\n  ".join(paths))

# Look locally first so the kit works on its own, then fall back to the master
# pack layout. Shipping the kit without the fonts is what broke this before.
FONTS = _first_existing(
    os.path.join(HERE, "assets", "fonts"),
    os.path.join(HERE, "..", "09-Document-Sources", "assets", "fonts"))
CUBE = _first_existing(
    os.path.join(HERE, "assets", "EDM-Cube-Mark-1024.png"),
    os.path.join(HERE, "..", "01-Brand-Identity", "Logo", "png", "EDM-Cube-Mark-1024.png"))

def font(weight, size):
    return ImageFont.truetype(os.path.join(FONTS, f"montserrat-{weight}.ttf"), size)

_cube = Image.open(CUBE).convert("RGBA")
_cube = _cube.crop(_cube.getchannel("A").getbbox())

def cube(height):
    r = height / _cube.height
    return _cube.resize((max(1, int(_cube.width * r)), height), Image.LANCZOS)

# ------------------------------------------------------------------- utilities
def tracked(draw, xy, text, fnt, fill, tracking=0):
    """Letter-spaced text. Returns the x position after the last glyph."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking
    return x

def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines

def block(draw, xy, text, fnt, fill, max_w, leading):
    x, y = xy
    for line in wrap(draw, text, fnt, max_w):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += leading
    return y

def eyebrow(draw, xy, text, size, colour=EMERALD, rule=True):
    x, y = xy
    f = font(700, size)
    if rule:
        draw.rectangle([x, y + size * 0.55, x + size * 2.6, y + size * 0.55 + max(2, size // 9)], fill=colour)
        x += size * 3.4
    return tracked(draw, (x, y), text.upper(), f, colour, tracking=size * 0.16)

def base_rule(im, draw, h):
    draw.rectangle([0, im.height - h, im.width, im.height], fill=EMERALD)

# ------------------------------------------------------------------- CTA
# One CTA appears on every asset. It sits in the furniture — a quiet footer
# line — never shouted in the headline. See CTA-SYSTEM.md.
CTA = {
    "package":     "Send the drawings and the programme  ·  enquiries@edmholdings.ae",
    "package_short": "Send the drawings and the programme",
    "contact":     "enquiries@edmholdings.ae  ·  +971 (0) 58 601 2021",
    # Used on recruitment assets — pass cta=CTA["hiring"] to statement() or
    # photo_frame() when the post is a job ad.
    "hiring":      "Send what you cover and where you're available  ·  enquiries@edmholdings.ae",
    "hiring_short": "enquiries@edmholdings.ae",
    "document":    "Capability statement at edmholdings.ae",
    # Not used on rendered artwork — this is the line for LinkedIn profile
    # Abouts and follow-up messages. Kept here so all six live in one place.
    "coffee":      "Christopher Simon  ·  +971 (0) 58 601 2021  ·  Happy to meet for a coffee",
}

def cta_footer(im, d, text, pad, rule, size=None, colour=EMERALD):
    """Quiet footer line sitting just above the emerald base rule."""
    size = size or max(14, int(im.width * 0.0195))
    f = font(600, size)
    y = im.height - rule - pad - int(size * 1.5)
    d.text((pad, y), text, font=f, fill=colour)
    return y

def save(im, name):
    path = os.path.join(OUT, name)
    im.save(path)
    print(f"  {name:52} {im.size[0]}x{im.size[1]}")
    return path

# ----------------------------------------------------------------- templates
def statement(size, eyebrow_text, headline, support, name,
              pad=None, hl=None, sup=None, mark=None, rule=None,
              cta=CTA["package"]):
    """Type-led statement card. Works with no photography, which is the point."""
    W, H = size
    pad  = pad or int(W * 0.093)
    hl   = hl  or int(W * 0.078)
    sup  = sup or int(W * 0.030)
    mark = mark or int(W * 0.085)
    rule = rule or max(6, int(W * 0.011))

    im = Image.new("RGB", size, GROUND)
    d  = ImageDraw.Draw(im)

    eyebrow(d, (pad, pad), eyebrow_text, max(13, int(W * 0.0165)))

    fh = font(700, hl)
    y  = pad + int(H * 0.14)
    y  = block(d, (pad, y), headline, fh, INK, W - pad * 2, int(hl * 1.16))

    if support:
        fs = font(400, sup)
        block(d, (pad, y + int(H * 0.035)), support, fs, MUTED, W - pad * 2, int(sup * 1.62))

    cta_y = cta_footer(im, d, cta, pad, rule)
    c = cube(mark)
    im.paste(c, (W - pad - c.width, cta_y - int(H * 0.028) - c.height), c)

    base_rule(im, d, rule)
    return save(im, name)


def stat_card(size, number, label, support, name, cta=CTA["package"]):
    """One number, one label. For a figure you can actually evidence."""
    W, H = size
    pad  = int(W * 0.093)
    im = Image.new("RGB", size, GROUND)
    d  = ImageDraw.Draw(im)

    eyebrow(d, (pad, pad), "EDM Holdings", max(13, int(W * 0.0165)))

    fn = font(700, int(W * 0.21))
    d.text((pad, pad + int(H * 0.20)), number, font=fn, fill=EMERALD)

    fl = font(700, int(W * 0.052))
    y = pad + int(H * 0.20) + int(W * 0.235)
    y = block(d, (pad, y), label, fl, INK, W - pad * 2, int(W * 0.062))

    if support:
        fs = font(400, int(W * 0.028))
        block(d, (pad, y + int(H * 0.03)), support, fs, MUTED, W - pad * 2, int(W * 0.046))

    rule = max(6, int(W * 0.011))
    cta_y = cta_footer(im, d, cta, pad, rule)
    c = cube(int(W * 0.085))
    im.paste(c, (W - pad - c.width, cta_y - int(H * 0.028) - c.height), c)
    base_rule(im, d, rule)
    return save(im, name)


def photo_frame(size, eyebrow_text, caption, name, split=0.62, cta=CTA["package"]):
    """Photograph on top, type beneath. The layout to use once real site
    photography exists — the grey block is where the image goes."""
    W, H = size
    pad  = int(W * 0.093)
    im = Image.new("RGB", size, GROUND)
    d  = ImageDraw.Draw(im)

    ph_h = int(H * split)
    d.rectangle([0, 0, W, ph_h], fill=(238, 240, 237))
    fp = font(600, int(W * 0.024))
    msg = "PHOTOGRAPH SITS HERE"
    tw  = d.textlength(msg, font=fp)
    tracked(d, ((W - tw - int(W * 0.024) * 0.14 * len(msg)) / 2, ph_h / 2 - int(W * 0.024)),
            msg, fp, (176, 184, 178), tracking=int(W * 0.024) * 0.14)

    y = ph_h + int(H * 0.045)
    eyebrow(d, (pad, y), eyebrow_text, max(13, int(W * 0.0165)))
    y += int(H * 0.045)
    fc = font(700, int(W * 0.043))
    block(d, (pad, y), caption, fc, INK, W - pad * 2, int(W * 0.056))

    rule = max(6, int(W * 0.011))
    cta_y = cta_footer(im, d, cta, pad, rule)
    c = cube(int(W * 0.058))
    im.paste(c, (W - pad - c.width, cta_y - int(H * 0.018) - c.height), c)
    base_rule(im, d, rule)
    return save(im, name)


def carousel_slide(index, total, eyebrow_text, headline, body, name, kind="body"):
    """1080x1350 carousel. Cover, body and end card share one grid."""
    W, H = 1080, 1350
    pad  = 96
    im = Image.new("RGB", (W, H), GROUND)
    d  = ImageDraw.Draw(im)

    if kind == "cover":
        eyebrow(d, (pad, pad), eyebrow_text, 17)
        y = pad + 200
        y = block(d, (pad, y), headline, font(700, 86), INK, W - pad * 2, 100)
        if body:
            block(d, (pad, y + 44), body, font(400, 32), MUTED, W - pad * 2, 52)
        f = font(700, 24)
        tracked(d, (pad, H - 150), "SWIPE", f, EMERALD, tracking=4)
        d.polygon([(pad + 130, H - 142), (pad + 158, H - 130), (pad + 130, H - 118)], fill=EMERALD)

    elif kind == "end":
        eyebrow(d, (pad, pad), eyebrow_text, 17)
        y = pad + 220
        y = block(d, (pad, y), headline, font(700, 72), INK, W - pad * 2, 86)
        if body:
            block(d, (pad, y + 40), body, font(400, 32), MUTED, W - pad * 2, 52)
        c = cube(120)
        im.paste(c, (pad, H - 320), c)
        d.text((pad, H - 160), CTA["contact"], font=font(600, 30), fill=EMERALD)

    else:
        f = font(700, 120)
        d.text((pad, pad - 10), f"{index:02d}", font=f, fill=(232, 236, 232))
        y = pad + 190
        y = block(d, (pad, y), headline, font(700, 60), INK, W - pad * 2, 74)
        if body:
            block(d, (pad, y + 40), body, font(400, 32), MUTED, W - pad * 2, 54)
        d.text((W - pad - 90, H - 150), f"{index}/{total}", font=font(600, 26), fill=MUTED)
        d.text((pad, H - 150), CTA["document"], font=font(600, 24), fill=MUTED)

    base_rule(im, d, 12)
    return save(im, name)


def story(eyebrow_text, headline, support, name, cta=CTA["package_short"],
          cta2=CTA["contact"]):
    """1080x1920. Safe zone: nothing in the top 250px or bottom 300px."""
    W, H = 1080, 1920
    pad = 96
    im = Image.new("RGB", (W, H), GROUND)
    d  = ImageDraw.Draw(im)

    eyebrow(d, (pad, 420), eyebrow_text, 17)
    y = 560
    y = block(d, (pad, y), headline, font(700, 82), INK, W - pad * 2, 96)
    if support:
        block(d, (pad, y + 48), support, font(400, 32), MUTED, W - pad * 2, 54)

    c = cube(110)
    im.paste(c, (pad, H - 620), c)
    d.text((pad, H - 470), cta, font=font(700, 40), fill=INK)
    d.text((pad, H - 410), cta2, font=font(600, 28), fill=EMERALD)

    d.rectangle([0, 250, W, 252], fill=HAIRLINE)
    d.rectangle([0, H - 300, W, H - 298], fill=HAIRLINE)
    d.text((pad, 200), "SAFE ZONE BELOW — UI COVERS ABOVE", font=font(600, 18), fill=(190, 196, 191))
    d.text((pad, H - 285), "SAFE ZONE ABOVE — UI COVERS BELOW", font=font(600, 18), fill=(190, 196, 191))

    base_rule(im, d, 12)
    return save(im, name)


def highlight_cover(label, name):
    """1080x1920 Instagram highlight cover — the visible crop is the centre circle."""
    W, H = 1080, 1920
    im = Image.new("RGB", (W, H), GROUND)
    d  = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    d.ellipse([cx - 300, cy - 300, cx + 300, cy + 300], fill=EMERALD)
    f = font(700, 62)
    tw = d.textlength(label, font=f)
    d.text((cx - tw / 2, cy - 40), label, font=f, fill=GROUND)
    return save(im, name)


def avatar(size, name):
    im = Image.new("RGB", (size, size), GROUND)
    c = cube(int(size * 0.74))
    im.paste(c, ((size - c.width) // 2, (size - c.height) // 2), c)
    return save(im, name)


def banner(size, headline, support, name, hl=None, sup=None, mark=None,
           block_y=None, left=None, rule=None, cta=None):
    W, H = size
    left = left or int(W * 0.27)
    hl   = hl or int(W * 0.023)
    sup  = sup or int(W * 0.0115)
    mark = mark or int(H * 0.54)
    rule = rule or max(5, int(H * 0.03))
    im = Image.new("RGB", size, GROUND)
    d  = ImageDraw.Draw(im)
    fh, fs = font(700, hl), font(400, sup)
    y = block_y if block_y is not None else int(H * 0.32)
    hb = d.textbbox((0, 0), headline, font=fh)
    d.text((left, y - hb[1]), headline, font=fh, fill=INK)
    sy = y + (hb[3] - hb[1]) + int(H * 0.06)
    d.text((left, sy), support, font=fs, fill=MUTED)
    if cta:
        d.text((left, sy + int(sup * 1.9)), cta, font=font(600, sup), fill=EMERALD)
    c = cube(mark)
    im.paste(c, (W - int(W * 0.05) - c.width, (H - rule - c.height) // 2), c)
    base_rule(im, d, rule)
    return save(im, name)


# ============================================================ CONTENT
# Edit below to re-render. Facts only — see DECISIONS.md.

if __name__ == "__main__":
    print("\nBanners")
    banner((1128, 191), "The interior shell, built right the first time.",
           "Self-delivered fit-out & drywall  ·  Dubai, UAE",
           "LI-company-banner-1128x191.png",
           hl=26, sup=13, mark=104, block_y=52, left=368, rule=6,
           cta=CTA["package_short"])
    banner((1584, 396), "Every interior trade. One contract.",
           "EDM Holdings  ·  Fit-out & drywall, self-delivered  ·  Dubai, UAE",
           "LI-personal-banner-1584x396.png",
           hl=42, sup=19, mark=200, block_y=104, left=430, rule=8,
           cta=CTA["contact"])

    print("\nProfile marks")
    avatar(400, "avatar-400x400.png")
    avatar(320, "IG-avatar-320x320.png")

    print("\nInstagram feed — square 1080")
    statement((1080, 1080), "How we build",
              "Every wall gets a number.",
              "The reference on the takeoff is the reference on the inspection record, and the one in the handover file two years later.",
              "IG-square-statement.png")
    stat_card((1080, 1080), "8",
              "inspection stages, every wall.",
              "Setting out, framing, services closed in, insulation, each layer of board, fire-stopping, decoration. Signed by the supervisor who looked at it.",
              "IG-square-stat.png")

    print("\nInstagram feed — portrait 1080x1350")
    photo_frame((1080, 1350), "On site",
                "A framed floor is a better photograph than a finished one.",
                "IG-portrait-photo.png")
    statement((1080, 1350), "Now hiring",
              "Fixers, tapers, ceiling hands and working supervisors.",
              "Directly employed. Steady work with one employer, proper supervision, and sites where the paperwork protects the people doing the job.",
              "IG-portrait-hiring.png", pad=96, hl=76, sup=32, mark=92, rule=12,
              cta=CTA["hiring"])
    statement((1080, 1350), "The trade",
              "Fire-stopping is the least visible work on a fit-out and the most important.",
              "Photographed and signed before it is covered. Once it is closed in, proving it means cutting into the wall.",
              "IG-portrait-statement.png", pad=96, hl=76, sup=32, mark=92, rule=12)

    print("\nCarousel — 1080x1350")
    carousel_slide(1, 5, "How we build",
                   "Five details that decide whether a package is easy or expensive.",
                   "None of them are glamorous. All of them are decided before anyone starts boarding.",
                   "IG-carousel-01-cover.png", kind="cover")
    carousel_slide(2, 5, "", "Setting out",
                   "From a survey of what was actually built, not the drawing alone. Slabs get poured out of tolerance and existing buildings are never what the record says.",
                   "IG-carousel-02-body.png")
    carousel_slide(5, 5, "EDM Holdings",
                   "Send the drawings and the programme.",
                   "You will get a straight answer the same working day.",
                   "IG-carousel-05-end.png", kind="end")

    print("\nStories / Reels covers — 1080x1920")
    story("Now hiring", "Fixers, tapers and ceiling hands.",
          "Directly employed. Steady work with one employer. UAE.",
          "IG-story-hiring.png",
          cta="Tell us what you cover.", cta2=CTA["hiring_short"])
    story("On site this week", "Zone handovers.",
          "Built, inspected, documented, signed, released. Then the next one.",
          "IG-story-progress.png")

    print("\nHighlight covers")
    for label, slug in [("WORK", "work"), ("TRADES", "trades"), ("SITE", "site"),
                        ("TEAM", "team"), ("JOBS", "jobs")]:
        highlight_cover(label, f"IG-highlight-{slug}.png")

    print("\nLinkedIn link card")
    statement((1200, 627), "Capability statement",
              "The interior shell, built right the first time.",
              "Nineteen pages. What we self-deliver, how it is inspected, and what you get at handover.",
              "LI-link-card-1200x627.png", pad=72, hl=54, sup=24, mark=76, rule=8,
              cta=CTA["document"])

    print(f"\nDone. {len(os.listdir(OUT))} files in ./templates/\n")
