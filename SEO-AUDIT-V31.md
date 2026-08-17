# v31 — SEO duplication audit and first two fixes

456 pages. Includes v27 to v30.

## First, a correction that changes the priority order

Google has no duplicate content penalty. Their documentation is explicit that
duplicate content is not grounds for manual action unless it is deceptive.
What actually happens to near-identical pages is filtering: they get
consolidated and only one is shown, so the others earn nothing while still
consuming crawl budget.

The real algorithmic exposure here is the scaled content abuse policy and the
helpful content signals, and a page that is 48% identical boilerplate is
genuinely exposed to both. So the work matters. It is just not a penalty, and
that matters because it means the fix is about earning rankings rather than
lifting a sanction.

## Diagnosis

A full pairwise scan of 455 indexable pages found 9,638 pairs at or above the
0.72 distinctness ceiling. That number turned out to be misleading.

Stripping shared boilerplate before measuring:

    pairs over 0.72 including boilerplate   9,638
    pairs over 0.72 excluding boilerplate     485

So roughly 95% of the apparent problem was ONE repeated block, not 456 badly
written pages.

The block: 33 sentences appearing on 400+ pages each.

    sitewide body words   411,279
    boilerplate           169,843   (41.3%)
    unique                241,436   (58.7%)

On a typical legacy page, about half the words were boilerplate.

### Where it sits, and why this is the worst part

The block is concentrated in the FAQ section. On birthday-number-11, 21 of the
31 FAQ sentences were shared with 408 other pages. The FAQ was a mad-lib: five
fixed questions with the page title substituted in.

    "How does MyNumerologyCharts explain {PAGE TITLE}?"
    "Why can {PAGE TITLE} differ between numerology websites?"
    "Where can I verify the method behind {PAGE TITLE}?"

Three problems, in order of severity:

  1. Those are not search queries. Nobody types them. They are questions about
     the website, not about the topic, so they can never match intent.
  2. They carried FAQPage schema on 409 URLs with identical answers. That is
     how structured data gets discounted across a whole domain.
  3. It breaks the site's own rule: "all FAQ must be unique and no repeat of
     FAQ throughout the website".

Note also that the mad-lib had propagated a factual error: the soul urge
calculator page claimed it "uses your date of birth". It uses a name.

## Fixed in v30 and v31

### 15 calculator pages (v30)

    worst pair   0.9871  ->  0.5116

Each now carries its real input, its real formula, a numbered worked example
with real numbers, and a section on why other sites disagree that is specific
to that calculation: the Y rule for soul urge, Pythagorean against Chaldean for
expression, birthday against 1 January for personal year, tie handling for
hidden passion, name length for karmic lessons.

### 31 birthday number pages (v31)

Mad-lib FAQ and templated "how should I use" section removed. Replaced with
content computed per day, so the pages differ by construction:

  - the actual reduction chain for that day
  - master number status (11th and 22nd held, not reduced)
  - karmic debt route (13th, 14th, 16th, 19th)
  - which other days share the reduced digit, named explicitly
  - digit order, since 12 leads with 1 and 21 leads with 2
  - five FAQs built from those computed facts

FAQPage schema rebuilt from the new visible text on all 31.

    worst pair   0.9023  ->  0.8860
    QA           0 failures across all 31

## Honest limit reached on the birthday cluster

The birthday pages are still at 0.886, well over the ceiling, and I stopped
rather than iterate further. The reason matters:

12 and 21 both reduce to 3. The computable facts about them are nearly
identical, so a generator cannot produce genuine differentiation. Each further
pass produced smaller gains from text that was itself templated, which is
duplication being moved rather than removed.

Two honest options for this cluster:

  a) 31 pieces of genuine editorial writing, one per day. Real work, not
     generation.
  b) Consolidate. If the content for the 12th and the 21st is genuinely almost
     the same, Google's own guidance for near-duplicates is to consolidate with
     a canonical rather than maintain both. This loses the long-tail queries
     for each day, which do have volume, so it is a trade rather than a win.

That decision is the owner's, and it should be made before more work goes in.

## STILL OUTSTANDING

378 pages still carry the mad-lib FAQ block and the templated use section.
These are the angel number, zodiac, compatibility, life-path-by-year and
number-meaning clusters.

Stripping the block without replacement drops those pages from a median 914
words to 294, which is too thin. So each cluster needs the same treatment the
birthday cluster just had: computed per-entity facts plus FAQs built from them.
That is several sessions of work, done cluster by cluster, and each one should
be measured before and after rather than assumed.

Priority order by pages affected in over-ceiling pairs:
angel numbers, zodiac and sun-sign, compatibility pairs, life path by personal
year, number meanings.

## Not done

  - "100% free" not removed. Playbook 10.5 requires it in the signup card and
    14 fails the build without it, and the claim is currently true. Needs the
    monetisation decision first.
  - iOS Safari not tested. No device available in this environment.
  - Lighthouse not run.

## Deploy

Upload, hard refresh, run tools/submit-index.js. Page count unchanged at 456.
46 pages have changed substantially, so IndexNow submission for those is worth
doing rather than waiting for a recrawl.
