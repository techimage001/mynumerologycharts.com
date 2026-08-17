# v30 — calculator duplication fix

456 pages, unchanged in count. Includes v27, v28 and v29.

## The problem

A full pairwise scan of all 455 indexable pages found 10,442 page pairs at or
above the 0.72 distinctness ceiling. The worst were the calculator pages:

    0.9871  life-path-calculator      | soul-urge-calculator
    0.9743  balance-number-calculator | personal-year-calculator
    0.9649  birthday-number-calculator| life-path-calculator

They were keyword-swap templates. Identical H2s, identical sentences, only the
calculator name changing:

    "Life Path Calculator uses your date of birth to produce a traditional
     numerology number and a transparent calculation trace..."
    "Soul Urge Calculator uses your date of birth to produce a traditional
     numerology number and a transparent calculation trace..."

The second sentence was also factually wrong: the soul urge uses a name, not a
date. Templating had propagated an error across the set.

## What was done

15 calculator pages rewritten with genuinely distinct content. Each now carries:

  - what input it actually needs (date, name, or both)
  - the real formula for that specific calculation
  - a numbered worked example with real numbers
  - why other sites give different results, specific to that calculation
    (the Y rule for soul urge, Pythagorean against Chaldean for expression,
     birthday against 1 January for personal year, tie handling for hidden
     passion, name length for karmic lessons)
  - 5 FAQs written for that calculator alone

Rewritten: life-path, soul-urge, expression-number, personality-number,
birthday-number, personal-year, personal-month, personal-day, attitude-number,
maturity-number, balance-number, hidden-passion, karmic-lessons, pinnacles,
challenge-numbers.

## Measured result

    Worst calculator pair    0.9871  ->  0.5116
    Calculator pairs >=0.72  many    ->  5 (all involving pages not rewritten)
    Sitewide pairs >=0.72    10,442  ->  9,638

    QA: 0 failures. 0 duplicate titles, 0 duplicate descriptions sitewide.
    Browser at 390 and 1280: drift 0, 1 H1, worked-example list renders,
    5 FAQs each, tables scroll on mobile only, 0 JS errors.

## STILL OUTSTANDING — the birthday number pages

The worst pairs on the site are now:

    0.9520  birthday-number-11 | birthday-number-20
    0.9461  birthday-number-15 | birthday-number-24
    0.9403  birthday-number-15 | birthday-number-8
    0.9401  birthday-number-12 | birthday-number-21

31 pages built from one template. Pages appearing in the most over-ceiling
pairs overall: birthday-numbers (196), life-path-sun-sign (159),
sun-sign-calculator (159), number-meanings (150), sun-sign-compatibility (145).

This is the next batch and it is larger than the calculator set: 31 pages, each
needing its own genuine content for a specific day of the month.

## Not done

  - "100% free" not removed: needs the monetisation decision, and playbook 10.5
    requires it while the claim is true.
  - iOS Safari not tested: no device available in this environment.
  - Lighthouse not run.
  - Angel-number modifier pages not built, deliberately, until duplication is
    under control.

## Deploy

Upload, hard refresh, run tools/submit-index.js. Page count unchanged so the
sitemap does not need resubmitting, though the content of 15 pages has changed
substantially and IndexNow submission for those is worthwhile.
