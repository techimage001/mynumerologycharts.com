# v38 — correct zodiac glyphs, mirrored palm, jurisdiction-neutral wording

457 pages. Includes v27 to v37. Everything else unchanged.

## 1. Zodiac glyphs were wrong on all twelve pages

I drew the glyph paths by hand from memory. They were wrong. My Aries was an
arch; the real one is two horns curling outward from a central descending
point. Nothing alike.

The process failure behind it matters more than the drawing: I screenshotted
ONE glyph, Leo, decided it looked plausible, and shipped twelve.

The fix removed my hand from the problem entirely. app.js and astrology.js
already contained the correct Unicode characters and had been rendering them in
the dashboard all along, which is why your app looked right and my pages did
not. The pages now use the same twelve characters:

    U+2648 to U+2653   aries through pisces

Each is followed by U+FE0E, the text-presentation selector, so iOS cannot
substitute a colour emoji.

VERIFIED BY LOOKING AT ALL TWELVE, not one. A contact sheet of every sign was
rendered and viewed side by side against your reference chart. All twelve
match. Codepoints confirmed U+2648 to U+2653, all distinct, none zero-width,
which would indicate a missing glyph.

## 2. The palm was a left hand labelled as a right hand

A right hand held palm-toward-the-viewer has the thumb on the viewer's RIGHT.
The drawing had it on the left, which is a left palm, while every caption said
"right palm".

The whole drawing is now mirrored as one group, so outline, lines, mounts and
the marriage and children lines all stay consistent with one another. The
little finger side, where the marriage lines sit, moves with it.

Confirmed geometrically: the Mount of Venus and the life line both now sit
right of centre. Eight finger creases added for readability, from your
reference sketches.

## 3. The at-a-glance avatar carries the glyph

The purple circle on each sign page showed a letter. It now carries the sign
glyph, which is stronger and removes the duplication with the diagram above it.
Confirmed correct and distinct on all twelve pages.

## 4. UK-specific legal wording removed

    was: "Under UK GDPR you have the right to erasure whether or not you can
          open your email..."
    now: "We will delete your record whether or not you can open that inbox, so
          nobody is locked out of erasing their own data."

This states what you actually do, which is true in every jurisdiction and needs
no legal citation. Audited the whole site for the same pattern: no remaining
instance of UK GDPR, EU GDPR, ICO, Information Commissioner, United Kingdom,
UK law, England and Wales or British anywhere.

## QA

    0 failures across 457 pages
    all twelve glyphs correct, distinct and rendering with real width
    palm mirrored, verified geometrically and by eye
    0 pages with UK-specific legal wording
    all PHP parses, all JS parses, all JSON-LD parses
    0 broken relative links

    Drift and errors at 320 / 390 / 1280px across index, two sign pages, a
    compatibility page, two palm pages, the deletion page and the app:
      all clean, drift 0, one H1 each, zero JS errors

    asset version v=32 sitewide

## Unchanged

Nothing outside the four items above was touched. The mobile stacked tables,
the theme fix, self-service deletion, internal linking, the FAQ rewrites and
all page content are exactly as they were in v37.

## Still open

iOS Safari, still untested from here. ios-check.html is in this build.
