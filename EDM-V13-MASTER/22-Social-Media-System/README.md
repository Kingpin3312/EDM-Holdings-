# 22 — SOCIAL MEDIA SYSTEM

Everything for LinkedIn and Instagram in one folder.

| File | What it is |
|---|---|
| `SOCIAL-PLAYBOOK.md` | Strategy for both channels, cadence, rules, measurement |
| `CTA-SYSTEM.md` | The one CTA, its five variants, where each sits, and the humanisation rules |
| `INSTAGRAM-CONTENT.md` | 30 captions, 6 carousel scripts, 6 reel scripts, story ideas |
| `make-templates.py` | Generates every template from the brand tokens |
| `templates/` | 19 rendered PNGs, ready to use |

**LinkedIn strategy, the 90-day calendar and 50 written LinkedIn posts live in
`13-Go-To-Market/LinkedIn/`.** This folder adds Instagram and the visual system;
it does not replace that document.

## Re-rendering templates

```
cd 22-Social-Media-System
python3 make-templates.py
```

Edit the content block at the foot of the script to change the copy. **Never
open a PNG and retype the text** — that is how the workwear and livery renders
drifted off-palette in V11. The script reads the tokens and the master cube
artwork directly, so a template cannot go off-brand.

Requires Pillow. Fonts come from `09-Document-Sources/assets/fonts` — the four
permitted Montserrat weights only.

## The CTA

Every asset carries one. `Send the drawings and the programme.` It sits in the
artwork footer rather than in the copy, which is why it can be on everything
without the account reading as a sales channel. The lines live in the `CTA`
dictionary at the top of `make-templates.py` — change them there and re-render.

LinkedIn is the primary lead generation channel. Instagram supports it.

## Two things to know before posting anything

**No client, project or main contractor may be named.** Consent is verbal only.
See `DECISIONS.md`.

**There is no site photography yet.** Every template works without one, which is
deliberate — a system that needs photographs you don't have stops in two weeks.
When photography arrives, shift to roughly 60% photographic and keep the type
cards; they are what make the grid look considered rather than like a camera
roll.
