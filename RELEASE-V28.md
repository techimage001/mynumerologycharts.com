# v28 — mobile table fix + karmic debt and name numerology clusters

Includes everything in v27. 425 pages -> 432.

## 1. Mobile table fix (carried from v27)

`site.css` had accumulated conflicting `table{...}` rules. The surviving pair
left `min-width:620px` on the table while the table was ALSO the scroll
container. An element cannot scroll itself when its own min-width forces it
wider than its parent, so the table overflowed its section and was clipped: at
390px the third column was unreachable.

Fixed with a `.table-scroll` wrapper as the scroll viewport, table back to
`display:table` inside it so columns stay aligned and the heading does not
scroll away.

Also fixed: `app.html`, `daily-horoscope.html`, `life-path-sun-sign.html`,
`sun-sign-calculator.html` and `sun-sign-compatibility.html` were pinned to
`v=20` while other pages were on `v=26`, risking stale JS on the tool itself.
All pages now `v=27`.

## 2. Seven new pages

Karmic debt was the one genuine gap in the core numerology offering: the site
had `karmic-lessons-calculator` (letters missing from a name), which is a
different concept entirely.

    karmic-debt-numbers.html       hub, comparison table, reduction rule
    karmic-debt-13.html            effort without immediate reward
    karmic-debt-14.html            freedom needing chosen structure
    karmic-debt-16.html            rebuilding on a sounder footing
    karmic-debt-19.html            independence and interdependence
    baby-name-numerology.html      new audience, no overlap with existing pages
    business-name-numerology.html  different audience again, commercial intent

Each carries: RankMath discipline (focus keyword first in title, description
under 155 leading with the keyword, keyword in H1 and opening sentence,
keyword in an H2), a 40 to 90 word answer-first block directly under the H1,
question-shaped H2s, six unique FAQs at 80 to 150 words, a table or numbered
list as an extractable structure, HowTo schema matching the visible list,
FAQPage schema parsed from the visible text, Article author set to the
Organization with no dates, absolute canonical, OG and Twitter, breadcrumbs.

## 3. Internal linking and footer

New footer group "Karmic Debt & Names" on all 432 pages. In-body links added
to `name-numerology.html`, `calculators.html` and
`karmic-lessons-calculator.html`, the last of these specifically to
distinguish karmic lessons from karmic debt. Sitemap updated.

## Verified

    Distinctness      max Jaccard new vs all 431 = 0.3781 (ceiling 0.72) PASS
                      max among the 7 new pages  = 0.3781
    Metadata          0 duplicate titles, 0 duplicate descriptions sitewide
                      every new description <=155 chars
    Structure         exactly 1 H1 each; answer block 35-95 words; a
                      question-shaped H2; a table or ordered list
    Schema            parses; Organization + WebSite + BreadcrumbList +
                      Article on every page; author is the Organization,
                      never a Person; no dates; FAQ questions visible verbatim
    Links             0 broken relative links; 431 inbound links per new page;
                      zero orphans; each links to parent and 6 siblings
    Sitemap           431 urls = 431 indexable pages exactly
    Cache busting     one asset version sitewide (v=27)
    Copy              no em dashes, no year in titles, no "no signup" claims
    Advertising       no ad tokens present
    Browser (390 and 1280px)
                      drift 0 at both widths, scrollX 0, hamburger present,
                      skip link present, cookie banner present, 6 FAQs
                      rendered, tables scroll on mobile only, 0 JS errors

## Decisions I made without confirmation

1. New pages written NEUTRALLY on price. They state the tool is free where
   relevant but carry no "100% free" claim, so a later move to monetise does
   not require rewriting them. The existing "100% free" wording in the signup
   modal is UNCHANGED on all pages, because removing it sitewide was not
   agreed and would touch every page.
2. Built 7 genuinely distinct pages rather than the ~120 in the review. The
   site sits at 0.7175 against a 0.72 ceiling; templated expansion is what
   breaches it. Angel-number intent modifiers (47 x 4) and Personal Year 2027
   are NOT built, and remain the highest-value next step.
3. No keyword volume data was pulled. These four gaps were identified by
   auditing the file list, not by volume research.
4. Karmic debt content deliberately pushes back on the alarmist framing common
   on competitor sites, particularly for 16, and names the paid-remedy pitch
   as a sales tactic. Consistent with the no-fabrication and honesty rules.

## Not verified

Real iOS Safari and Android Chrome. Lighthouse Core Web Vitals. `tools/build.js`
was NOT executed: it carries a `wrapTables()` helper so a future regeneration
keeps the fix, but the new pages come from `tools/emit-v28.js`.

## Deploy

Upload, hard refresh, run `tools/submit-index.js`, resubmit sitemap (page count
changed 425 -> 432). No secrets change; `mnc_private/secrets.php` untouched.
