# V14 Final QA Report

Date: 30 July 2026

## Automated test result

- HTML pages checked: 88
- Checks passed: 14,042
- Checks failed: 0
- Maximum main-content Jaccard similarity: 0.715
- Closest pair: number-2.html / number-7.html

Command: `node tools/tests.js`
Exit status: 0

## What the corrected test suite verifies

- One H1 per page
- Unique and appropriately sized titles and meta descriptions
- Correct absolute canonical URL on every page
- Viewport metadata and exact short disclaimer on every page
- Removal of rejected public terminology
- Meaningful image alt text
- Parseable JSON-LD
- BreadcrumbList presence and valid itemListElement entries
- Existing local links
- FAQ markup consistency where FAQ sections exist
- Near-duplicate content threshold
- robots.txt bot rules
- IndexNow key and submission script
- Sitemap completeness and unique URLs
- Responsive CSS protections
- JavaScript syntax for site.js, app.js and daily-horoscope.js

## Additional checks

- PHP syntax: 8 files checked, 0 errors
- ZIP archive integrity: passed
- Daily Horoscope breadcrumb added
- Three overlong page titles shortened and their Open Graph, Twitter and source catalogue titles synchronised

## Important deployment note

Local checks cannot force Google Search Console to recrawl the site. After upload, request validation in Search Console and test the live URLs in Google Rich Results Test. Browser-dependent features such as speech voices, printing and email delivery should also be smoke-tested on the deployed server.
