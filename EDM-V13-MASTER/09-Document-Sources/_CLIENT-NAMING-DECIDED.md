# Client naming — DECIDED, 22 August 2026

**Christopher Simon: generalise the list.** Applied and rebuilt the same day.

## What changed

Page 17 of the capability statement previously named six firms as clients:

> JLL · Gilbert-Ash · Graham · John Sisk & Son · McLaughlin & Harvey · Farrans

None was in the consent register and `consents/` is empty. PMK Group had already
been removed from the same block for exactly that reason, which is what made the
remaining six look like a decision rather than an oversight.

The names are gone from the public edition. The page now answers its own question
— "who we work with" — with the buyer, what is being appointed, the track record,
and the naming position itself:

> **Naming our clients.** We do not publish a client list. Where a client requires
> consent before being named we ask them first, including for our current UAE
> delivery — and we would extend you the same courtesy. Package-specific
> references, matched to the sector you are asking about, are provided on request.

That reads as a stronger answer to a procurement team than a logo wall, and it is
consistent with page 16, which already states the same consent position.

## Verified after rebuild

- 19 pages, unchanged — the count is stated in four places and all four still hold
- Every printed page number matches its actual position
- Montserrat only, all embedded
- No unconsented name, no banned wording, no absolute claim
- The website download is byte-identical to the corporate-documents copy

## If you want a name back

1. File the written consent in `consents/` as `<client>-consent-YYYY-MM-DD.pdf`.
2. Add the name back in `capability-statement-public.html` — the block carries a
   comment listing exactly what was removed — and run `build.sh`.
3. Never by editing the PDF. `tools/compliance-check.py` will keep reporting a
   name until its consent is on file.

## Still open

The corporate brochure never named anyone, so it needed no change. The **PQQ pack**
remains outstanding for a different reason — see
`13-Go-To-Market/_PQQ-PACK-CORRECTIONS-NEEDED.txt`.
