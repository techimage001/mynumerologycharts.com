# v18 — GSC breadcrumb fix confirmed, horoscope surfaced + SEO pages

- HOMEPAGE BREADCRUMB: homepage BreadcrumbList now carries a valid itemListElement
  (single Home item). This resolves the Google Search Console error
  "Missing field itemListElement" seen on the live (older) build.
- DAILY HOROSCOPE: the existing daily-horoscope tool was orphaned (not linked).
  Now linked in the main nav ("Horoscope") and the footer.
- "Today's Horoscope": the app daily section already reads "Today's Horoscope"
  (the live site is an older deploy that still says "Personal Insight").
- NEW: 12 per-sign horoscope pages (aries-horoscope ... pisces-horoscope) + a
  "Horoscopes by Zodiac Sign" hub, evergreen and linking into the free daily tool.
- 400 pages, 0 QA failures, max similarity 0.7175 (under the 0.72 ceiling).

## v18 update — love/career horoscopes + clarification
- Added 12 per-sign LOVE horoscope pages and 12 CAREER horoscope pages
  (aries-love-horoscope, aries-career-horoscope, ...), linked from the
  Horoscopes hub. Targets long-tail like "[sign] love horoscope".
- Clarification: the daily-section boxes were NOT dropped in this build. They
  were already reworded to positioning-safe labels: "Today's colour" -> "Symbolic
  Colour" and "Lucky numbers" -> "Featured Numbers". Only the live (older) deploy
  still shows the old wording.
- Now 424 pages, 0 QA failures, max similarity 0.7175 (under the 0.72 ceiling).
