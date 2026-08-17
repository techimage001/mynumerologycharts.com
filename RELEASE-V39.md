# v39 — footer displacement fix and a full structural audit

457 pages. Includes v27 to v38.

## What I broke, and how

The footer appeared halfway down app.html with the chart results rendering
below it. That was my fault, introduced in the v33 iOS hardening pass.

I added this, appended to the END of site.css:

    .result-panel,.app-shell .preview,.sticky-preview{
      max-height:calc(100vh - 102px);
      max-height:calc(100dvh - 102px);
    }

I assumed .result-panel was a sticky preview panel. On app.html it is the main
results container. Worse, site.css already contained six .result-panel rules,
and four of them deliberately reset it:

    .result-panel{position:static;max-height:none;overflow:visible;border:0}

Because my rule sat at the end of the file it overrode every one of those
resets. The results container was capped at roughly 800px, main ended early,
the footer rose to fill the gap, and the rest of the chart overflowed below it.

Measured, original v25 against the broken build:

    v25        footer at 12343px, document 13064px, 0 elements below footer
    broken     footer at  2917px, document 10976px, results below the footer
    fixed      footer at 11574px, document 12616px, 0 elements below footer

## The fix

The dvh fallback now sits ON the original rule, in its correct position in the
cascade, so the site's own later resets still win:

    .result-panel{position:sticky;top:86px;
      max-height:calc(100vh - 102px);max-height:calc(100dvh - 102px);
      overflow:auto}

The appended block is gone. A comment in its place records why appending it was
wrong, so it does not get reintroduced.

## A second error found by the audit, not by you

angel-numbers.html had an unclosed <section>. The "More angel number meanings"
block was missing its closing tag, consumed by the non-greedy regex I used to
strip the mad-lib FAQ in v32:

    <section class="faq"[\s\S]*?</section>

Non-greedy matching stops at the FIRST closing tag, which in that page belonged
to a different element. Tag restored, page now balanced.

## Full structural audit

Every one of the 457 pages checked for:

    unbalanced section, main, div, figure, article, table and details tags
    more or fewer than one H1
    footer appearing before </main>
    JSON-LD that does not parse
    broken relative links
    stale wording (UK GDPR, 100% free, Delete My Data)

    RESULT: 0 failures

Rendered audit of 24 representative pages at 390px and 1280px, covering the
homepage, the app, the A to Z, palmistry, zodiac, compatibility, angel numbers,
calculators, the deletion page and the diagnostics page:

    horizontal drift 0 everywhere
    exactly one H1 everywhere
    footer at the document end everywhere
    zero elements rendering below the footer
    zero JavaScript errors

    RESULT: all 24 pages clean at both widths

## What this changes about how I check

Tag balance and footer position were not in my QA until now. Both errors would
have been caught before shipping if they had been. They are now part of the
structural sweep, along with a rendered check that nothing sits below the
footer, which is what would have caught the app.html regression immediately.

Asset version v=33 sitewide.

## Deploy

Upload, hard refresh. No secrets change. Worth reloading app.html specifically
and scrolling to the bottom to confirm the footer sits where it should.
