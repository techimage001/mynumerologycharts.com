# v34 — stacked mobile tables and palm diagrams

457 pages. Includes v27 to v33.

## 1. The table was still unreadable, and you were right

v27 made the table scroll. That was the wrong fix, and the screenshot showed
why: iOS Safari hides scrollbars entirely, and the fade cue I added used
background-attachment: local, which is unreliable in WebKit. So the table
scrolled but nothing indicated it could be scrolled. It read as broken.

The deeper error was mine: a 560px table on a 375px screen should not scroll
at all. It should restructure.

Below 640px every table now reflows into one card per row. The row heading sits
at the top of the card, and each value below it is prefixed with its column
heading, pulled from a data-label attribute generated from the table's own
<th> cells. Nothing is hidden, nothing needs a gesture, and no content sits
outside the viewport.

The markup is still a real <table>. Only the CSS display changes, so desktop
rendering and screen-reader semantics are untouched.

    693 cells across 72 pages given data-label
    verified 320 / 375 / 390 / 640 / 1280px:
      drift 0 at every width
      td display: block below 640px, table-cell at 1280px
      last cell fully inside the viewport at every width
      no horizontal scroll required anywhere

## 2. Palm diagrams

24 palmistry pages now carry a diagram, placed directly under the answer block
so it is visible without scrolling.

One master SVG serves all of them. Every line and mount is a separate element
with an id; each page sets data-hl on the wrapper and CSS draws that element in
the brand colour at full weight while everything else stays faint. Because
there is only one drawing, all 24 diagrams are consistent with each other by
construction.

Code-drawn paths only. No photograph, no traced source, nothing licensed, in
line with the playbook's copyright rule. Colours come from the theme variables,
so the diagram follows light and dark mode.

Covered: heart, head, life, fate, sun, marriage, children and intuition lines;
Venus, Jupiter, Saturn, Apollo, Mercury, Moon and both Mars mounts. The Mars
page highlights both mounts, since there are two.

Mobile handling: no fixed width, so it scales; aspect-ratio reserved on the
wrapper so it cannot cause layout shift; capped at 240px wide below 520px.
Each carries role="img" with an aria-label naming the highlighted line, and a
visible caption repeating it, so the page still works with images off.

The caption also states plainly that this is a schematic and that real hands
vary. That is true and worth saying: the lines are placed from description, not
traced from a photograph.

## Two bugs I introduced and fixed during this pass

The first insertion put the figure above the H1, because my replace matched the
site header rather than the page heading. Caught on the screenshot, not in the
assertions, which is a fair argument for looking at output rather than only
measuring it.

The marriage and children line groups did not highlight, because my highlight
regex expected a class attribute those <g> elements did not have.

## QA

    0 failures across 457 pages
    24 pages carry a diagram, each with aria-label, caption, and the figure
      after the H1
    0 duplicate figures
    0 broken relative links
    all JSON-LD parses
    asset version v=29 sitewide

## Deploy

Upload, hard refresh. Then open ios-check.html on your iPhone and send the
copied results, and look at the homepage table and any palm page while you are
there.
