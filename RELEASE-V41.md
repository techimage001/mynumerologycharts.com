# v41 — footer restored, palm rebuilt

457 pages. Includes v27 to v40.

## 1. Footer restored

You asked me to check the footer POSITION. I removed 24 palmistry links and 12
zodiac links to fix a cosmetic gap you had not complained about, and justified
it by citing your own playbook. That was a navigation regression traded for a
visual tidy-up, decided unilaterally.

Both groups are now byte-identical to v38:

    Palmistry  24 links
    Astrology  19 links

The gap those links caused is a CSS grid issue, not a content issue. It stays
until it can be fixed in CSS without touching navigation. A slightly loose
footer is better than missing links.

## 2. Palm rebuilt

The old drawing was freehand and looked like a mitten: four near-identical stub
fingers, a notch beside the little finger, a thumb stuck on with no web, and a
bulbous palm base.

The new one is constructed from measured proportions rather than sketched:

    palm length ~= finger length, a true 50/50 split
    index 0.92, ring 0.96, little 0.76 of the middle finger
    finger widths: index 21, middle 22, ring 20, little 17
    ONE continuous outline, wrist through each finger to the thumb and back,
      rather than a palm shape with separate fingers laid over it, which is
      what produced the notch

Right hand, palm toward the viewer, thumb on the viewer's right. Drawn
correctly this time rather than mirrored after the fact, so the mirror
transform is gone.

Two nudges applied after review: a shallower notch between index and thumb, and
a wider gap between little and ring fingers.

Every line and mount keeps its id, so each page still highlights its own
subject. All 15 ids verified present. Marriage and children lines were moved
inside the palm edge, where they had been floating outside it, and scaled up so
they are legible on the pages that matter most.

## QA

    0 structural failures across 457 pages
    24 palm figures, all after the H1, none duplicated
    footer: Palmistry 24 links, Astrology 19 links, matching v38
    16 rendered checks at 390px and 1280px across the homepage, the app,
      palmistry, zodiac and the A to Z: all clean
        drift 0, one H1, footer at document end, nothing below it, no JS errors
    asset version v=35 sitewide

## Deploy

Upload, hard refresh. No secrets change.
