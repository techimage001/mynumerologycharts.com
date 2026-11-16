# v42: Name Checker, blog portal, SEO fixes

458 pages (v41 had 457). Built from your v41 zip by `tools/v42_patch.py`,
which edits the built pages directly. **Do not run `tools/build.js`**: it is
older than the live site (its header has no Palmistry link, and 36 pages such as
the palm and karmic-debt pages are not in it), so running it would undo work.

## 1. Name Checker (new paid product)

- **`name-checker.html`**: compare up to 10 names against a birth date, in four
  modes: baby name, business name, married or new name, and your own name.
  Pythagorean (default, matches the rest of the site) or Chaldean.
- **Free:** a ranked list with a score out of 100 and one sentence explaining each score.
- **Paid** (unlocked with a Lemon Squeezy licence key):
  - the full pairing table and letter working for every name
  - respellings that keep the sound and score higher
  - a side-by-side chart
  - a print-ready page ("Save as PDF")
- The scoring method is printed on the page. Same number scores 100, same root 95,
  same family (1-5-7, 2-4-8, 3-6-9) 82, and contrast 55. Results are shown on a 40 to 100
  scale, so no name is ever presented as "bad". The maths matches `assets/numerology.js`:
  checked against Jordan Alex Taylor (6/2/4) and Aaliyah Smith (9/3/33), with Life Path 4
  for 25 Nov 1975.
- **Pricing:** £9 buys a **30-day pass**, not a single check. A single check cannot be
  enforced fairly in a browser, and parents compare names over weeks. £19 buys unlimited
  access for life.
- **Placement tracking:** every buy link carries `checkout[custom][placement]` (for
  example `number-33`, `marriage-line`, `app-results` or `blog`), so Lemon Squeezy shows
  which page made each sale.

## 2. Where it appears

- **Navigation:** "Name Checker" with a "New" badge on all 458 pages, plus a footer link.
  On screens between 821px and 1380px wide, the header hides Methodology, then Horoscope,
  then Palmistry and Learn so nothing wraps. These links are still in the footer.
  Header overlap was checked at 10 widths.
- **Full checker** embedded on four existing pages:
  - baby-name-numerology (baby mode)
  - business-name-numerology (business mode)
  - birth-name-vs-current-name (married mode)
  - name-numerology (own-name mode)
- **Mini checker** on 115 pages. You type a name, see its number instantly, and get a
  link to the full checker. Pages:
  - number-1 to 33
  - marriage-line
  - pinnacles, birthday-number, expression, soul-urge and personality calculators
  - chaldean-vs-pythagorean, why-calculators-disagree, lucky-numbers, master-numbers
  - the 12 life-path-number pages
  - the 81 life-path × personal-year pages
- **Homepage:** a "Choosing a name?" card.
- **app.html:** a prompt under the chart results once a name has been entered
  (`assets/name-app-hook.js`; app.js is untouched).
- **Blog articles:** the mini checker is in the call-to-action at the foot of every article.

## 3. SEO fixes

- **Number pages:** new titles and descriptions on the 12 pages
  (e.g. "Master Number 33 Meaning: Life Path, Name and Love").
- **Meta descriptions:** fixed 38 that were cut off mid-sentence, such as
  "...cautions for the." and "...whether a palm can.". These were 25 life path ×
  personal year pages plus 13 rewritten by hand.
- **Correction:** I told you earlier that marriage-line had two `<title>` tags. The
  second one is the label inside the palm SVG drawing, which is valid. That was not a bug.
- **Sitemap and robots:** `name-checker.html` added to sitemap.xml and llms.txt.
  `sitemap-blog.xml` added to robots.txt, and `/cron/` disallowed.
- **Privacy:** privacy.html now has a paragraph naming Lemon Squeezy as the payment processor.

## 4. Blog portal (site side)

- **Portal files:** `bco-loader.php`, `site-profile.php`, `admin/` and `cron/`.
  The header and footer in the profile are the site's own, with absolute links so they
  work inside `/blog/slug/`. The blog has its own "Blog" nav link.
- **`assets/blog.css`:** the blog styled in the site's colours, including dark mode.
- **House rules for the AI writer:**
  - entertainment framing and no predictions
  - Pythagorean working shown and double-checked
  - never tell readers to change a name
  - avoid the four phrases your test harness bans
- **Categories:** Name Numerology, Baby Names, Business Names, Marriage & Name Changes,
  Life Path & Core Numbers, Cycles & Timing, Compatibility.
- **`.gitignore`** now excludes `/blog/`, `/p/`, `/uploads/blog/` and `sitemap-blog.xml`,
  so a deploy never carries or overwrites published articles.

## Tested here

- **Site tests:** `node tools/tests.js` gives 178,522 passed, 31 failed. **All 31
  failures already existed in v41** (FAQ answers on birthday-number-4 to 9, and a
  banned word on head-line and palm-reading). None are new.
- **Licence endpoint**, against a fake Lemon Squeezy server:
  - 30-day key and lifetime key
  - a key from another store (rejected)
  - activation limit reached
  - unknown key and malformed key
  - re-validation
  - rate limit (20 per hour, then 429)
  - unconfigured store (polite message)
- **Browser, desktop and mobile:**
  - ranking, unlock and paid report
  - respellings
  - business mode
  - unlock surviving a reload
  - mini checker values and links
  - homepage card and app prompt
  - no console errors and no horizontal overflow
- **Blog portal** running on a copy of this site:
  - setup, login and every admin page
  - cron publishing 4 articles
  - blog index, category page, article and sitemap-blog
  - every internal link on an article returning 200
  - your 50-keyword CSV imported (50 rows, all 7 categories matched)

## Not proven here

- **Real Lemon Squeezy:** this sandbox cannot reach the internet. Your first test
  purchase (use Lemon Squeezy test mode) is the real check.
- **Real article generation:** same limit. The engine itself is unchanged from what
  runs on strongmomquotes.com.
- **Emailing results** to free users was not built. Sending arbitrary emails from a
  public form would be a spam risk. The existing double opt-in signup is unchanged.
