# v27 — mobile table fix

Scope: the mobile table cut-off only. No content, layout, copy, schema or page
was changed. 422 of 425 pages are byte-identical to v26 once the asset version
query string is normalised; the remaining 3 differ only by the added wrapper.

## The bug

At 390px the comparison table was clipped at the section edge with no way to
scroll to the third column.

`site.css` had accumulated several conflicting `table{...}` rules across
releases. The surviving combination was:

    table{display:block; overflow-x:auto}   <- table is the scroll container
    table{min-width:620px}                  <- ...forced wider than its parent

An element cannot scroll itself when its own `min-width` makes it wider than
its parent. Measured at 390px: table 620px wide inside a 368px section,
`scrollWidth === clientWidth`, so `canScrollSelf` was false. The section had
`overflow-x: visible`, so the overflow was simply clipped by the body's
`overflow-x: clip`.

## The fix

A `.table-scroll` wrapper is now the scroll viewport, and the table returns to
`display:table` inside it.

Making the section itself scroll was tried first and rejected: it scrolled the
H2 heading off-screen along with the table.

## Changed files

| File | Change |
|---|---|
| `assets/site.css` | `.table-scroll` rules appended; existing rules untouched |
| `index.html`, `methodology.html`, `numerology-and-astrology.html` | table wrapped in `.table-scroll` |
| all 425 pages | asset version query string bumped to `v=27` |
| `tools/build.js` | `wrapTables()` helper added so regeneration keeps the wrapper |

## Also fixed: stale cache version

`app.html`, `daily-horoscope.html`, `life-path-sun-sign.html`,
`sun-sign-calculator.html` and `sun-sign-compatibility.html` were pinned to
`v=20` while the other 420 pages were on `v=26`. The tool itself was therefore
at risk of serving stale `app.js` and `numerology.js`. All pages are now on
`v=27`. Playbook 3.2 requires exactly one version sitewide; asserted below.

## Verified headless (Chromium 131, real DOM measurement)

    Horizontal drift at 320/360/375/390/414/430/768/1280
        scrollWidth - clientWidth === 0 and scrollX === 0 at every width

    Table scroll at 390px
        wrapper canScroll   true   (clientWidth 328, scrollWidth 560)
        section canScroll   false  (heading stays put)
        last column reachable and fully visible after scrolling

    Sticky regression on app.html
        .result-panel has no scroll-container ancestor introduced by this change

    Cache busting
        863 asset references, all v=27, one version sitewide

    Content integrity vs v26
        422 pages byte-identical once version normalised
        3 pages differ only by the wrapper element
        0 unexpected differences
        sitemap.xml unchanged

## Not verified

Real iOS Safari and Android Chrome. Momentum scrolling and the scroll-shadow
cue should be checked on a real handset.

## Deploy

Upload, hard refresh. No secrets change. `mnc_private/secrets.php` untouched.
