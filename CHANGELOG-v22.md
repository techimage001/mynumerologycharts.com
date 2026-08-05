# v22 — real logo wired into header + footer

- Replaced the invisible "9" placeholder (white text on a transparent circle)
  with the real emblem (assets/logo-mark.svg: purple gradient disc, gold orbit
  ring, cream star, gold centre), embedded as INLINE SVG in the header and footer.
- Inline SVG can't 404 or break on a partial deploy, and renders site-wide.
- Header and footer use separate gradient IDs (mncgA / mncgB) to avoid duplicate-ID.
- Verified: logo visible, 0 accessibility violations, emails still 0, QA clean.

Includes everything prior: 425 pages, email removal, footer/mobile/button fixes,
lucky numbers, love/career horoscopes, a11y pass. 0 QA failures, similarity 0.7175.
