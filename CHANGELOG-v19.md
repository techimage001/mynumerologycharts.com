# v19 — lucky numbers/colour, lucky-numbers SEO page, accessibility pass

Supersedes v18. Everything from v18 plus:

- DAILY SECTION: relabelled "Featured Numbers" -> "Lucky numbers" and
  "Symbolic Colour" -> "Lucky colour". These are computed transparently from
  the user's own chart (Personal Day, Life Path, Personal Year for numbers;
  Personal Day -> colour), and the disclaimer stays ("not a prediction").
- NEW PAGE: lucky-numbers-numerology.html, an evergreen SEO page for the
  high-volume term "lucky numbers", linking into the free tool. Linked in footer.
- ACCESSIBILITY: ran axe-core across homepage, app and content pages and fixed
  every serious violation:
  * added role="img" to the trait and frequency bar tracks (aria-label was
    invalid on a bare div) - 17 instances;
  * darkened the gold section eyebrow on light backgrounds to meet WCAG AA
    contrast (kept gold on the dark hero) - 11 instances.
  Result: 0 axe violations on homepage, app and daily-horoscope.

## Totals
425 pages, 0 QA failures, similarity 0.7175 (under 0.72), single asset version
(v=16) sitewide, zero em dashes.
