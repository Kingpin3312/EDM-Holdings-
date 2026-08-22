# LEADERSHIP PORTRAITS — SHOOT BRIEF

All four portraits now exist. This brief is no longer about filling gaps — it is
about making the set match.

**On file:** Eddie Duffy, Damien Meenan, Christopher Simon, Kenny Buchanan.
All cropped to 4:5 at 760 × 950. As-supplied originals and 1520 × 1900 masters
are in `assets/people/_originals/` — recrop from those, never from the 760 × 950.

**The set does not match, and on one page it shows.** Four different shoots:

| | Setting | Framing | Light |
|---|---|---|---|
| Christopher | Grey studio seamless | Tight, to the shoulders | Even, frontal |
| Damien | Open-plan office | Looser, head and chest | Daylight from behind |
| Eddie | Hotel or event interior | Head and chest, warm ground | Warm ambient, candid |
| Kenny | Outdoor | Tighter crop | Natural, directional |

Backgrounds run grey, white, cream and outdoor. Colour temperature runs cool to
warm. Two are posed and two are candid. Individually all four are usable; side
by side the eye reads four photographers rather than one leadership team, and
that is the impression a procurement manager forms in half a second.

**It is presentable as it stands. It is not yet consistent.** A half-day session
with all four in the same room fixes it permanently, and Christopher's studio
setup is the closest thing to a house standard — brief against that.

## Specification — match Kenny's exactly

| | Spec |
|---|---|
| Aspect ratio | 4:5 portrait |
| Delivered size | 760 × 950 px minimum, 1520 × 1900 preferred |
| Format | JPEG, sRGB, quality 85 |
| Crop | Head and upper chest. Eyes roughly one third down the frame. |
| Framing | Same distance and same eye height for all four, so they sit level in a row |
| Background | Plain and light. A white or pale wall. Not a site hoarding, not a logo wall. |
| Lighting | Soft, from one side, no direct flash. Daylight through a window works. |
| Expression | Neutral to slight smile. Looking at the camera. |
| Dress | Business or smart business. Consistent across the four — either all in a jacket or none. |
| Retouching | None beyond exposure and a straighten. No skin smoothing, no vignettes, no duotone. |

## File names — replace in place when new photographs arrive

```
02-Website/edm-site/assets/{eddie-duffy,damien-meenan,christopher-simon,kenny-buchanan}.jpg
09-Document-Sources/assets/people/{eddie-duffy,damien-meenan,christopher-simon,kenny-buchanan}.jpg
```

Overwrite with the same names at 760 × 950 and run `./build.sh`. Nothing else
changes — the markup already points at these paths in the website, the
capability statement and the brochure.

The monogram fallback is still in the stylesheet and still works. It is now
unused, and it stays there for the next joiner rather than because anyone is
missing a photograph.

## Doing it properly in one go

Half a day covers all four. Pictures taken in the same room on the same day sit
together in a way that four matched afterwards never quite do. Christopher's
studio setup is the reference to brief against.

Same visit should also cover the site photography brief in the pack. One
mobilisation, two deliverables.

## One check before publishing

Any portrait that goes on the website or into a tender document should be an
original photograph of that person. Reverse image search is a routine step in
supply-chain diligence, and a director's portrait that resolves to a stock or
generated library is the kind of finding that ends an onboarding without a
conversation. Worth confirming provenance for each of the four before issue.

## What not to do

- No AI-generated or stock portraits. A procurement team that reverse-image
  searches a "director" and finds a stock library has learned something about
  the firm that no document can undo.
- No cropped group photos, no phone snaps in a car, no LinkedIn screenshots.
- Don't mix: three studio portraits and one site photograph reads worse than
  four monograms.
