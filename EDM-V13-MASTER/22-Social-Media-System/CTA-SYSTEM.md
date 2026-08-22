# THE CTA SYSTEM

**One ask. Same words everywhere. Sitting in the furniture, never shouted.**

LinkedIn is the primary lead generation channel. Everything below exists to make
sure that when someone finally decides to act, they do not have to go looking for
how.

---

## 1. THE PRINCIPLE

There is a difference between **a CTA on every asset** and **a sales pitch in
every post**, and most construction marketing collapses the two.

A CTA in the furniture — a quiet footer line on the artwork, a contact block at
the foot of a document, a fixed line in a profile — is present on everything and
costs nothing. It is there when someone is ready.

A CTA in the copy — "contact us today", "get in touch to discuss your
requirements" — is asking. Do that on every post and procurement stops reading,
because the account has become a sales channel rather than a source of
information.

**So: the CTA appears on 100% of assets and in roughly 10% of captions.**

This is not a softer position. It is the one that generates more enquiries,
because the reader gets to decide when, and the decision feels like theirs.

---

## 2. THE PRIMARY CTA

> **Send the drawings and the programme.**

It is already the strongest line the business owns. It appears on the contact
page, in the capability statement, in the brochure and on the LinkedIn banners.

Why it works, and why nothing should replace it:

- It is an **instruction, not a request**. "Get in touch" asks for a favour.
  This tells a commercial manager exactly what to do with the thing already on
  their desk.
- It is **specific to the buyer's moment**. Someone with drawings and a
  programme has a live package. It self-qualifies.
- It **sounds like a person**. No contractor says "discuss your requirements".
  Plenty say send me the drawings.
- It is **free to act on**. There is no meeting to agree, no form to fill in.

Paired response line, used wherever there is room:

> *You will get a straight answer the same working day.*

That sentence is the actual offer. It is also a commitment — so it only stays in
if it is kept.

---

## 3. THE FIVE VARIANTS

Defined once in `make-templates.py` as the `CTA` dictionary, so every rendered
asset draws from the same source and none can drift.

| Key | Line | Where |
|---|---|---|
| `package` | Send the drawings and the programme · enquiries@edmholdings.ae | Default. Every feed card, statement and photo template. |
| `package_short` | Send the drawings and the programme | Banners and stories, where space is tight |
| `contact` | enquiries@edmholdings.ae · +971 (0) 58 601 2021 | Carousel end cards, personal banners |
| `hiring` | Send what you cover and where you're available · enquiries@edmholdings.ae | Recruitment posts only |
| `document` | Capability statement at edmholdings.ae | Link cards, carousel body slides |
| `coffee` | Christopher Simon · +971 (0) 58 601 2021 · Happy to meet for a coffee | Personal profiles, follow-up |

**Never invent a sixth.** If a new context appears, add it to the dictionary and
re-render, so it exists in one place.

---

## 4. WHERE IT SITS — ASSET BY ASSET

| Asset | CTA | Placement |
|---|---|---|
| LinkedIn company banner | `package_short` | Emerald line under the support line |
| LinkedIn personal banners | `contact` | Same position, all four profiles |
| LinkedIn link card | `document` | Footer |
| LinkedIn company page | `package` | Button set to the capability statement, plus final line of the About |
| LinkedIn profiles | `coffee` | Final line of each About |
| Instagram bio | short form | Line 2, plus link |
| Feed cards, all sizes | `package` | Footer, above the emerald rule |
| Carousel body slides | `document` | Bottom left, quiet |
| Carousel end card | `package_short` as headline, `contact` beneath | The whole slide is the CTA |
| Stories | `package_short` + `contact` | Above the bottom safe zone |
| Recruitment anything | `hiring` | Replaces the default |
| Capability statement | `package` | Contact page, and the closing line of the About |
| Corporate brochure | `package` | Contact page |
| Handover standard | `contact` | Footer band |
| Email signatures | `contact` | Already in place |

Every asset. No exceptions, including the ones nobody expects a CTA on — that is
the point of putting it in the furniture rather than the message.

---

## 5. IN CAPTIONS AND POSTS

Roughly one post in ten carries an explicit ask. The rest carry the CTA only on
the artwork.

**When a post does ask, use one of these. Nothing else.**

> Send the drawings and the programme and you'll get a straight answer the same
> working day.

> If you've got an interior package coming up in the UAE, send it over. Happy to
> take a look.

> Worth a coffee if you're pricing interiors at the moment.

> Send what you cover and where you're available — enquiries@edmholdings.ae

> Tell us the format your supply chain system needs and we'll send it in that
> format.

**Banned, permanently.** These are on the brand guidelines' no-use list and they
are the difference between reading as a contractor and reading as a marketing
account:

*Let's talk about your package · Contact us today · Get in touch to discuss your
requirements · Reach out · Drop us a line · Let's connect · DM us for a quote ·
We'd love to hear from you · Don't hesitate to contact us · Looking forward to
hearing from you · Feel free to reach out*

---

## 6. THE HUMANISATION RULES

Everything published must read as though a person in the trade wrote it. The
tells below are what make writing look generated, and they are more damaging in
construction than in most sectors — this is an industry where sounding like a
brochure is itself a credibility problem.

**Structural tells — avoid:**

- Em dashes in every paragraph. One per page is plenty.
- Three-item lists in every sentence. *"Professional, reliable and
  cost-effective"* is the sound of nobody.
- "It's not just X, it's Y."
- Opening with a rhetorical question.
- Closing by summarising what you just said.
- Every paragraph the same length.
- Starting sentences with "Moreover", "Furthermore", "Additionally".
- A tidy conclusion on a post that did not need one.

**Vocabulary tells — avoid:**

*delve · leverage · robust · seamless · elevate · unlock · game-changer ·
tapestry · testament · landscape (figurative) · realm · navigate (figurative) ·
foster · harness · streamline · empower · cutting-edge · state-of-the-art ·
solutions (as a noun for what you sell) · operational excellence · synergy ·
best-in-class · world-class · industry-leading · passionate about · committed to
excellence · in today's fast-paced*

**What to do instead:**

- Use a real number, a real detail, a real trade. "W07" beats "our systems".
- Let one sentence be short. Then let the next one run on a bit, the way people
  actually talk.
- Say the awkward thing plainly. *"It costs more on paper"* is more persuasive
  than any adjective.
- Use UK English throughout. Programme, metre, colour, licence.
- Read it aloud. If you would not say it across a table, rewrite it.

**The test that catches most of it:** could this sentence have been written about
any other contractor in Dubai? If yes, it is not saying anything. Replace it with
something only EDM could write.

---

## 7. HOW THIS IS ENFORCED

The CTA lines live in one dictionary in `make-templates.py`. Change it there,
re-run the script, and every asset updates. Nothing is retyped into an image, so
nothing drifts.

The banned-wording list is checked automatically on the four client-facing PDFs
by `09-Document-Sources/build.sh`. It greps for the salesy closers and the jargon
and reports a count that must be zero.

For social copy there is no automated check, so the rule is a human one: whoever
posts reads section 6 before they write, and Christopher approves anything
client-related.
