# MyNumerologyCharts v15 — content expansion

Built on the v14 release. Same app, backend, design system and SEO/AEO plumbing.
All new pages are generated through the existing tools/build.js from tools/gen-clusters.mjs,
so they carry identical chrome, schema, breadcrumbs, cookie banner and footer.

## Added — 139 new distinct pages (high-traffic clusters v14 was missing)
- Angel numbers: 1 hub + 36 meaning pages (angel-numbers.html, angel-number-*.html)
- Life Path meanings: 1 hub + 12 pages, 1-9 and masters 11/22/33 (life-path-numbers.html, life-path-number-*.html)
- Numerology compatibility: 1 hub + 45 Life Path pair pages (numerology-compatibility.html, life-path-*-and-*-compatibility.html)
- Birthday numbers: 1 hub + 31 "born on the Nth" pages (birthday-numbers.html, birthday-number-*.html)
- Personal Year: 1 hub + 9 pages (personal-years.html, personal-year-*.html)
- Name numerology hub (name-numerology.html)
- 5 category hubs linked from a new "Explore by Number" footer group (no orphans)

Content is generated from real per-entity data (meanings, angel numbers, personal years,
birthdays), so every page is distinct by construction, not keyword-swapped boilerplate.

## Fixes applied sitewide (in tools/build.js)
- Footer disclaimer now matches the QA harness exactly ("For entertainment purposes only...").
- Homepage BreadcrumbList now has a valid single Home item (was empty, failed QA).
- Removed the em dash from the shared enhancement intro (no em dashes anywhere now).

## Verified (headless / static — no browser in the build environment)
- tools/tests.js: 227 HTML pages, 52,754 assertions passed, 0 failed.
- Content similarity (Jaccard, 5-shingle) max 0.7327, under the 0.75 ceiling.
  Closest pair is two pre-existing v14 pages, not new ones.
- Cookie consent banner present on every page (via the generator's cookies()).
- Zero em dashes across all 227 pages. All favicons present.
- Sitemap URLs: 226, one per indexable page (asserted by the harness).

## Needs a human to open in a browser
- Visual/mobile spot-check of the new pages on a device.
- The personality-fingerprint radar in the app is NOT added in this pass (the app's
  existing frequency chart, per-section audio, tabs and theme toggle are untouched).

## Mobile / all-device optimisation pass
- Fixed a sitewide bug: html/body carried a bare `overflow-x:hidden` (one global rule
  and one inside the <=650px block), which per the playbook turns the page into a scroll
  container and silently disables `position:sticky` on every descendant. Both switched to
  `overflow-x:clip` (the `@supports not(overflow-x:clip)` fallback at the top of site.css
  still covers very old browsers). This restores the sticky header and the app's sticky
  calculator panel on mobile and desktop, while still preventing horizontal drift.
- Asset version bumped to v=10 so the CSS fix busts caches; verified exactly one asset
  version across all 227 pages (459 references).
- v14's existing mobile work is retained and inherited by the new pages: hamburger drawer,
  3->2->1 card reflow, horizontally scrollable tables, >=44px tap targets, and breakpoints
  down to 380px.

### Still needs a human with a browser (no browser in the build environment)
- Confirm on a real phone at 360/390/414px: sticky header behaves, no horizontal scroll,
  hamburger opens, and the new hub/spoke pages read well. Static checks all pass; the visual
  pass is the one thing I cannot run here.
