# v33 — WebKit hardening and an on-device check

457 pages (456 indexable, plus ios-check.html which is noindexed).

## What I could not do, stated plainly

I cannot test iOS Safari from this environment. There is no iOS device here,
and Playwright WebKit, which is the same engine Safari uses and would have been
a genuine partial substitute, cannot be installed because the browser download
is blocked by the container network allowlist. Roleplaying as a Safari engineer
would not change either fact.

What I could do is two things that are real: apply knowledge of specific WebKit
behaviour to fix bugs Chromium cannot reveal, and build you a page that runs
the measurements on your actual device.

## 1. Four genuine WebKit bugs, found by audit and fixed

These were live on the site and invisible in Chromium.

**backdrop-filter had no -webkit- prefix.** Three rules used it: the sticky
site header, the dashboard tab bar and the math tiles. Safari requires the
prefixed property on the iOS versions still in common use, and drops the rule
silently without it. The effect was that the sticky header lost its blur and
sat as a flat semi-transparent panel with page text scrolling visibly through
it. Prefixed versions added.

**No text-size-adjust.** Safari inflates text when a phone rotates to
landscape unless this is pinned, so headings jump size mid-session. Now set to
100% with the prefixed property alongside.

**100vh used for the result panel height.** On iOS the address bar overlays
the page, so 100vh measures the taller area including it, making the element
extend past the visible screen with its bottom unreachable until the bar
collapses. Now uses dvh with vh retained first as the fallback.

**No safe-area insets.** On notched iPhones in landscape the full-bleed sticky
header runs under the sensor housing. env(safe-area-inset-*) now pads the
header and the footer clear, with a 0 fallback so nothing changes on devices
without a notch.

Also added: overscroll-behavior-x on the table wrapper, so swiping a wide table
horizontally cannot chain into the browser back-navigation gesture.

Checked and already correct: input font-size is 16px, so iOS will not zoom on
focus; overflow-x: clip has its hidden fallback; no :has() is used anywhere.

## 2. ios-check.html — run this on your phone

    https://mynumerologycharts.com/ios-check.html

Twelve measurements against whatever engine displays the page, each reporting
PASS or FAIL with the number behind it:

    horizontal drift            sticky header actually sticking
    table scrolls sideways      dvh support
    heading stays put           visual viewport API
    backdrop-filter support     overflow-x clip support
    safe-area inset support     flex gap support
    input font size             reduced-motion preference

Plus an informational line for engine, :has() and touch points, kept out of the
pass/fail scoring so a green result means everything that matters is green.

It also includes a live table to swipe by hand, since momentum scrolling has to
be felt rather than measured, and it re-runs automatically on rotation.

A Copy results button puts the whole report plus your device string on the
clipboard. That gives a measurement rather than an impression, which is far
more useful to act on than "the table looked wrong".

Nothing is uploaded, nothing is stored, no identifier is created. The page is
noindexed and excluded from the sitemap: it is a tool, not content.

Verified in Chromium at 390px: 12 tests render, all pass, 0 JS errors, 0 drift.
That verifies the harness works. It does not verify Safari, which is the whole
point of you running it.

## What a green result would tell us

That the four fixes above landed, the table fix from v27 works on the real
engine, and the sticky header behaves. A FAIL on any line is specific enough to
fix directly.

## QA

    0 failures across 457 pages
    0 duplicate titles, 0 duplicate descriptions
    0 broken relative links
    ios-check noindexed and correctly absent from the sitemap
    sitemap 455 = 455 indexable content pages

## Deploy

Upload, hard refresh, then open ios-check.html on your iPhone and send me the
copied results.
