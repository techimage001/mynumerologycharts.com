# MyNumerologyCharts v16 — radar, content rewrite, verified in-browser

Built on v15. App, backend, design system and SEO/AEO plumbing preserved.
This release was screenshot-verified with a headless Chromium (desktop + mobile),
not just static checks.

## Added / changed
- APP: personality-fingerprint RADAR added to the trait section (assets/app.js),
  rendered from the same 10-trait data as the bars. Floats beside the bars on
  desktop, stacks on mobile. SVG, no dependency.
- CONTENT REWRITE: the 12 thin number pages (number-1..9, 11, 22, 33) rewritten
  with real per-number meaning (symbolism + all-position lenses), distinct from
  the life-path-number-* pages.
- QA FIX: rewrote personality-number-guide, which cleared the one over-ceiling
  pair. Max content similarity is now 0.7175 — under the playbook's 0.72 ceiling.
- MOBILE: results panel is sticky under the inputs below 900px so the preview
  stays in view while scrolling.
- Cache version bumped to v=12 sitewide (single version verified).

## Deliberately NOT shipped (with reasons)
- 81-cell Life Path x Personal Year matrix: a formulaic 9x9 grid breaches the
  0.75 distinctness ceiling (same-year cells share too much), so Google would
  filter it as scaled content. It needs genuine per-combination writing, not a
  formula. Held rather than ship thin pages.
- Moon and rising signs: require birth time + location inputs and an accurate
  ephemeris. Not shipped unverified — accurate astrology is the site's whole
  credibility pitch, and a wrong result is worse than none.

## Verified (headless Chromium + harness)
- tools/tests.js: 227 pages, 52,737 assertions, 0 failures.
- Max Jaccard 0.7175 (< 0.72 playbook ceiling).
- Radar confirmed rendering in the app at 1280px and 390px (screenshots).
- Zero em dashes, cookie banner on every page, single asset version v=12,
  favicons present, sitemap = 226 indexable URLs.
