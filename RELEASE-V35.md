# v35 — internal linking

457 pages. Includes v27 to v34.

## What the audit found

Asked whether the new pages had internal links, I checked rather than answered
from memory, and found a real gap.

    hub -> all children in-body       COMPLETE (8/8, 7/7, 4/4, 4/4, 4/4)
    new page -> parent + siblings     COMPLETE (4 to 8 targets each)
    footer coverage                   COMPLETE (456 pages, zero orphans)
    homepage -> any new section       NONE
    calculators/astrology/guides ->   NONE
    A to Z directory                  8 links, for a 457-page site

So the 31 new pages formed a closed island: internally well linked, but
reachable from the rest of the site only through the sitewide footer. Footer
links are boilerplate and are discounted heavily, so almost no editorial link
equity was reaching the palmistry section at all.

Playbook 9 is explicit on both counts: footer links alone are not sufficient,
and the homepage should link every hub directly so the crawl fans out from one
click.

## The A to Z directory was the bigger find

The page claimed to provide "a direct route to every main calculator, number
meaning, guide and trust page". It carried 8 links. That was both a dead
linking asset and an untrue statement on the page.

It now lists all 454 indexable pages, alphabetically, in 21 letter groups with
jump links. Built by reading the H1 from every page, so it cannot drift out of
step with what actually exists.

    A to Z in-body links   8  ->  454

## Also added

Homepage: an "What else can you explore here?" section in the body linking
palm reading, karmic debt, name numerology and the A to Z directory.

calculators.html: karmic debt, baby name and business name numerology.
astrology.html: palm reading and hand shapes, framed as another tradition read
from the person.
numerology-guides.html: karmic debt, name numerology and palm reading.

## Result

    in-body inbound links per new page   min 2, max 28
    pages with fewer than 2              none
    every new page reachable in two clicks from the homepage
    QA 0 failures across 457 pages, 0 broken relative links

## A note on how the fix went

Two of my edits silently skipped on the first attempt, because the guard I
wrote checked for the link anywhere in the page body, and the nav sits inside
that region. The links already existed in the navigation, so the guard
concluded the work was done. Caught it on the verification pass rather than
trusting the "already linked, skipped" output.

## Deploy

Upload, hard refresh, run tools/submit-index.js. Page count unchanged.
a-z.html changed substantially and is worth submitting individually.
