# v20 — three post-deploy corrections

1. FOOTER (desktop): the 8th column ("Company & Legal") was orphaning to a
   second row and stacking vertically. Pulled the legal links out of the
   directory grid into a centred HORIZONTAL bar above the copyright line;
   the directory is now a clean 7-column row.

2. MOBILE: the birth date / time / place input panel was pinned
   (position:sticky, max-height 46vh) and blocked ~half the screen. Removed
   that rule - the input panel now scrolls normally so results are reachable.

3. SHARE/DOWNLOAD BUTTONS: they were never removed, but they sat in the input
   panel (above the results). Moved them to a proper report-actions panel
   BELOW the results (Preview Image, Share, Download PNG, Download JPG, plus
   Print, Save, Saved Charts, Copy Link) - where they belong and where you
   expected them.

425 pages, 0 QA failures, similarity 0.7175, single asset version (v=17).
