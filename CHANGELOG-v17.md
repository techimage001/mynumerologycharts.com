# MyNumerologyCharts v17 — all recommendations, verified in-browser

Built on v16. App, backend, design system and SEO/AEO plumbing preserved.
Every new feature was screenshot-verified with a headless Chromium.

## Added in this release
- MOON & RISING SIGNS (app): birth-time + birth-place inputs (city picker),
  a bundled MIT ephemeris (astronomy-engine), moon sign and Ascendant computed
  and shown in the dashboard. Math verified against known charts (Einstein,
  JFK, Diana). Rising is honestly labelled as time-sensitive.
- NAME COMPATIBILITY (app): the compare tool now also scores two people by their
  Expression and Soul Urge (name) numbers, alongside the date-based score.
- ZODIAC SIGN COMPATIBILITY: 66 distinct sign-pair pages + hub, built from
  element, modality and ruling planet.
- 81-CELL MATRIX: every Life Path (1-9) x Personal Year (1-9) combination, now
  written distinctly enough to clear the 0.72 ceiling (previous formula did not).
- MORE ANGEL NUMBERS: 11 additional high-search sequences.
- THIN PAGES REWRITTEN: the 15 remaining boilerplate guide pages
  (what-is-numerology, master-numbers, pythagorean-numerology, etc.) rewritten
  with real content.
- Personality-fingerprint RADAR in the app (from v16).

## Verified (headless Chromium + harness)
- tools/tests.js: 387 pages, 121,512 assertions, 0 failures.
- Max content similarity 0.7175 — under the playbook 0.72 ceiling. The closest
  pair is two pre-existing compatibility pages, not any new matrix or zodiac page.
- Moon/Rising, name compatibility, radar and matrix pages all screenshot-checked
  on desktop and mobile.
- Single asset version (v=13) sitewide, zero em dashes, cookie banner on every
  page, favicons present, sitemap = 386 indexable URLs.

## Site totals
88 (v14) -> 387 pages.
