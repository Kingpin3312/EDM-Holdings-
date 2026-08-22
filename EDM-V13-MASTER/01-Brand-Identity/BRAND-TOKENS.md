# EDM HOLDINGS — BRAND TOKENS

The complete, authoritative list. Anything not on this list is not an EDM colour.
Added V12 because the palette existed in the Brand Guidelines PDF but nowhere
machine-readable, which is how drift happens.

## Core palette

| Token | Hex | Use |
|---|---|---|
| ground | `#FFFFFF` | Backgrounds. The default. |
| emerald | `#083819` | Primary brand colour. Rules, fills, logo. |
| ink | `#0F231B` | Headlines and body text. |
| muted | `#5C6F66` | Secondary text, captions, support lines. |
| hairline | `#E4E6E0` | Dividers, borders, table rules. |

## Logo artwork only

| Token | Hex | Use |
|---|---|---|
| cube grey 1 | `#7C8282` | Cube mark. Never used as a UI colour. |
| cube grey 2 | `#9EA3A2` | Cube mark. Never used as a UI colour. |

Resolved in V12: the livery swatch bar previously labelled the steel tone
`#9AA3A0`. Both vector logo sources (`favicon.svg`, `edm-logo.svg`) and the
1024px cube master use `#9EA3A2`, so that value is authoritative. The render
and its swatch bar have been corrected to match.

## Interaction states

| Token | Hex | Use |
|---|---|---|
| emerald-hover | `#0A4A21` | `.nav-cta:hover` only. |

This value was already in use on all 20 website pages before it appeared in any
guideline. It is documented here rather than removed, because removing it would
mean 20 edits and no visible improvement. Do not extend it to new elements.

## Third-party, permitted

| Hex | Use |
|---|---|
| `#25D366` / `#1EBE5B` | WhatsApp button only. WhatsApp's own brand colours. |

## Regulated, not brand

| Hex | Use |
|---|---|
| `#D7E021` | Hi-vis on PPE renders. A safety colour, not a brand colour. |

## Retired — must never reappear

`#F5F2EA` `#F4F1E9` `#F2EFE7` and any other bone or ivory tint
`#0E3A2C` and any green other than `#083819`
Any sage. Any bronze.

Bone was the dominant ground of the workwear and vehicle livery renders as
late as V11, and the livery swatch bar printed `#0E3A2C` and `#F5F2EA` as if
they were the brand palette. Both corrected in V12.

## Typeface

Montserrat only. Four weights, and only four: Light 300, Regular 400,
SemiBold 600, Bold 700. **Medium 500 is not in the system** — if a 500 weight
appears anywhere, it is an error. Self-hosted at
`02-Website/edm-site/assets/fonts`. Never a second family. Never a system font
fallback that is allowed to show.

## Known exception to fix

`01-Brand-Identity/Brand-Guidelines.pdf` embeds DejaVu Sans Bold for the ✕
glyphs on the "Getting it wrong" page. The brand document therefore contains a
second typeface. Fix when the guidelines get an editable source.
