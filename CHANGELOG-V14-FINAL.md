# V14 Final Fix Changelog

- Replaced the brittle QA script with attribute-order-independent validation.
- Removed incorrect requirements that every page must contain the same FAQ and HowTo structure.
- Added meaningful checks for metadata, schema, links, accessibility, disclaimers, terminology, sitemap, responsive CSS and JavaScript syntax.
- Fixed root-relative link resolution in the test runner.
- Added missing BreadcrumbList schema to daily-horoscope.html.
- Shortened three titles that exceeded the QA title-length limit and synchronised OG/Twitter metadata plus data/pages.json.
- Updated an old release-note reference from the retired wording to Daily Horoscope.
- Final automated result: 14,042 passed, 0 failed.
