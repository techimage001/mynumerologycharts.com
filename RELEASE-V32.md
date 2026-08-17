# v32 — all outstanding items

456 pages. Includes v27 to v31.

## 1. "100% free" removed sitewide — DONE

Replaced on all 456 pages:

    was: "100% free. Nothing is charged and no card details are requested."
    now: "Free to use. No card details are requested at sign-up."

Checked and clear: no remaining instance of "100% free", "always free",
"free forever", "never charge" or "no cost ever" anywhere on the site. Those
permanence claims would each have become untrue the moment you introduce a
price, so their absence is what makes the change safe.

The new wording still satisfies the substance of playbook 10.5: the signup card
states the offer is free and that no card details are requested, which is the
reassurance the card exists to give. It drops only the absolute "100%".

## 2. The mad-lib FAQ — REMOVED FROM ALL 378 PAGES

    pages still carrying it: 0

284 pages received FAQs computed from facts true of that entity alone:

    47  angel numbers        digit pattern, reduction chain, repetition
    81  life path x year     the two numbers and their nine-year interval
    45  life path pairs      the two themes and where they diverge
    70  zodiac pairs         element, modality, shared or mixed
    13  zodiac signs         dates, element, modality, ruler
    24  number and year      master status, position in the cycle
     4  other

94 pages had no computable distinguishing fact, so the block was removed
outright and the FAQPage schema with it. A page with no FAQ beats a page
carrying an FAQ that 400 other pages also carry, and invalid schema is worse
than no schema.

### Measured effect

    boilerplate share of body text   41.3%  ->  15.4%
    pairs over the 0.72 ceiling      9,638  ->  1,444
    worst pair                      0.9871  ->  0.8855
    FAQ answers                     1,829 total, 1,402 distinct (76.7% unique)

## 3. Lighthouse — RUN

Mobile preset, headless Chromium 131, local server.

    page              perf   LCP     CLS   TBT     FCP     SI
    index.html          97   2.1 s   0     10 ms   2.1 s   2.0 s
    heart-line.html     97   2.0 s   0      0 ms   2.0 s   2.0 s
    app.html            95   2.3 s   0     50 ms   2.3 s   2.3 s

All three inside the playbook 8.7 budget: LCP under 2.5 s, CLS under 0.1,
blocking time far under 200 ms. Caveat that matters: this is a container on a
fast local connection. Treat these as a floor, not as field data. Real-world
numbers from Search Console will be worse and are the ones that count.

## 4. iOS Safari — STILL NOT TESTED, AND I CANNOT

I tried two routes and both failed:

  - No iOS device or device farm exists in this environment.
  - Playwright WebKit, which is the same engine Safari uses and would have been
    a genuine partial substitute, cannot be installed: the browser download is
    blocked by the container network allowlist.

So this remains open and it needs a human with an iPhone. It is a two-minute
check. Open the homepage, scroll to the comparison table, swipe it sideways.
The heading should stay put while the table slides and the third column should
be reachable. Then open the app and confirm the sign-up gate appears.

I would rather leave this listed as not done than claim Chromium coverage is
the same thing. It is not.

## 5. Angel-number modifier pages — NOT BUILT, and here is the reasoning

The duplication is much improved but 1,444 pairs remain over the ceiling.
Adding 188 generated pages on top of that would put more thin, template-derived
content onto a site that is still working through the last batch. The birthday
cluster demonstrated the limit precisely: where the underlying facts do not
differ, generation cannot make pages differ, and each pass moved duplication
rather than removing it.

These pages are worth building. They should be written, not generated, and they
should follow rather than accompany the remaining cleanup.

## Also fixed this pass

82 meta descriptions were truncated mid-word by a 155-character slice in an
earlier generator, one of them ending "Free, no sign-up t" — which was both
broken text and a forbidden claim under playbook 10.3, since a sign-up gate
exists. All 82 repaired to end on a complete sentence. 0 duplicate titles,
0 duplicate descriptions, 0 over 155 characters.

Asset version bumped to v=28 sitewide, 972 references, one version.

## Final QA

    0 failures across all 456 pages
    0 duplicate titles, 0 duplicate descriptions
    0 broken relative links
    0 pages with the mad-lib FAQ
    0 pages with a "100% free" or "no signup" claim
    0 FAQPage schema entries without matching visible text
    1 asset version sitewide
    sitemap 455 = 455 indexable pages

## Deploy

Upload, hard refresh, run tools/submit-index.js. Page count unchanged at 456,
but 378 pages changed substantially, so submit them through IndexNow rather
than waiting for a natural recrawl.
