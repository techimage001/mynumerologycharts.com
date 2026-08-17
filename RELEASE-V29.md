# v29 — palmistry section

432 pages -> 456. Includes everything in v27 and v28.

## What was built

24 new pages under a palmistry pillar:

    palm-reading.html           main hub, honest limits stated up front
    palm-reading-guide.html     guided selector tool
    palm-lines.html             lines hub
      heart-line, head-line, life-line, fate-line, sun-line,
      marriage-line, children-lines, intuition-line
    palm-mounts.html            mounts hub
      venus, jupiter, saturn, apollo, mercury, mars, moon
    hand-shapes.html            shapes hub
      earth-hand, air-hand, fire-hand, water-hand

Each carries a 40-90 word answer block under the H1, question-shaped H2s,
5-6 unique FAQs, a variation table, a "what this cannot tell you" section,
HowTo and FAQPage schema parsed from visible text, Article author set to the
Organization with no dates, absolute canonical, breadcrumbs.

## The guided tool

`palm-reading-guide.html` plus `assets/palmistry.js`. Choose a line, the tool
shows where to find it; choose what it looks like, it returns the traditional
reading for that exact combination plus the limits, and links to the full page.

It reads its data from an inline JSON block emitted by the generator from the
SAME dataset that builds the line pages, so tool and pages cannot drift apart.
No upload, no storage, no network call. Deliberately no photo upload: palm-line
detection from a phone photo is unreliable, and a misidentified line produces a
confident reading of the wrong thing.

## Editorial position

The marriage, children and life line pages are where competitors are weakest
and where the traffic is. Those pages answer the question directly and then
state plainly what the reading cannot do:

  - the life line does not measure lifespan
  - the marriage line cannot predict marriage, timing or divorce
  - children lines cannot indicate fertility, and the claim that certain
    markings show a woman is unlikely to conceive has no basis
  - no palm feature can diagnose any physical or mental condition
  - the head line has no relationship to intelligence

The palm-reading hub states in its own words that palmistry is widely classed
as a pseudoscience, and gives the two reasons why, before any interpretation
appears. This is the differentiator, not a caveat bolted on.

## Verified

    Distinctness   max Jaccard palmistry vs all 455 = 0.4720 (ceiling 0.72) PASS
    Metadata       0 duplicate titles, 0 duplicate descriptions sitewide
                   every new description <=155 chars
    Structure      1 H1 each, answer block 35-95 words, question-shaped H2,
                   table or ordered list, every table wrapped for mobile
    Schema         parses; Organization + WebSite + BreadcrumbList + Article;
                   author is the Organization; no dates; FAQ text visible
    Links          0 broken relative links; footer group on all 456 pages;
                   Palmistry added to the main nav sitewide
    Sitemap        455 urls = 455 indexable pages
    Cache busting  one asset version sitewide (v=27)
    Browser        drift 0 at 390 and 1280, 0 JS errors, tables scroll on
                   mobile only, guided tool returns correct reading + limits
                   + working link

## PRE-EXISTING PROBLEM FOUND — needs a decision

A full pairwise scan of all 455 indexable pages found **10,442 page pairs at or
above the 0.72 distinctness ceiling**. This predates v27 and is not caused by
any new page. Worst offenders:

    0.9871  life-path-calculator      | soul-urge-calculator
    0.9743  balance-number-calculator | personal-year-calculator
    0.9649  birthday-number-calculator| life-path-calculator
    0.9520  birthday-number-11        | birthday-number-20

The calculator pages are near-identical to each other, and several birthday
number pages are close duplicates. Pages appearing in the most over-ceiling
pairs: birthday-numbers (211), life-path-sun-sign (174), sun-sign-calculator
(174), number-meanings (164).

This is the scaled-content pattern that gets pages filtered rather than ranked.
It is very likely a bigger constraint on current traffic than any missing page,
and it should be fixed before more pages are added.

## Not done, and why

  - "100% free" NOT removed. Your playbook 10.5 requires it in the signup card
    and 14 fails the build without it. The claim is currently true. Removing it
    needs the monetisation decision first.
  - iOS Safari NOT tested. No iPhone available in this environment. Needs a
    real handset.
  - Lighthouse NOT run this pass.
  - The ~120 angel-number modifier pages NOT built, given the duplication
    finding above.

## Deploy

Upload, hard refresh, run tools/submit-index.js, resubmit sitemap
(432 -> 456 pages). No secrets change.
