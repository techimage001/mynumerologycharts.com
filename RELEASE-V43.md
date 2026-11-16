# v43: Name Checker is free, with boy/girl, middle names, downloads and sharing

Built on v42 by `tools/v43_patch.py` (plus the edited asset files below). Do not run `tools/build.js`.

## Changes
- **Everything is free.** Ranking, full working, respellings, middle-name finder, downloads and sharing. The payment code is still there but switched off: `'paid' => false` in `api/name-checker-config.php`.
- **Boy / Girl / Not sure yet** in baby and middle-name modes. Each name is labelled Girl's name, Boy's name or Unisex, with a gentle note when it doesn't match. The score is unchanged, and the page says so. Labels come from `assets/names.json`: 16,421 names from US Social Security birth records 1980-2016 (public domain). It is only loaded in those two modes. Names not in the list say "Name not in our list" rather than guessing.
- **Automatic capitals:** "mary-jane o'neil" becomes "Mary-Jane O'Neil".
- **Middle-name finder:** enter a first name, an optional surname and the date. Leave the list empty to get 12 suggestions from the most-used names for the chosen sex, or type your own to compare them. Equal scores are ordered by how widely the name is used.
- **Save and share:** the same buttons and pop-ups as the chart page.
  - Preview Image, Share (phone share menu with the image attached), WhatsApp
  - Download PNG and JPG (1080×1350 branded card)
  - Download PDF Report (a real PDF file, made in the browser with no library)
  - Save on This Device and Saved Shortlists
  - Copy Private-Safe Link
- **Privacy defaults:** the date of birth is left out of images and links unless the box is ticked. A shared link reopens the same ranking, or asks for the date if it was left out.
- **Optional signup prompt** after the report ("Tell me about new tools"), using the existing double opt-in form.
- **Anonymous usage counts** (`api/nc-stats.php`): daily totals per action and page, with no personal data. **They only run for visitors who accept optional analytics in the cookie banner**, matching the banner's promise that analytics stay off otherwise. View them at `/api/name-checker-stats.php` with the admin password from secrets.php.
- **Copy updates:** FAQ, privacy paragraph and homepage card now describe a free tool. The privacy page no longer mentions payments.

## Tested here
Desktop and mobile with no console errors and no horizontal overflow. Checked:
- the boy/girl labels and mismatch note
- automatic capitals
- the PNG, JPG and PDF files (each downloaded and opened)
- preview, save on device and the saved list
- private and dated share links opened in a fresh browser
- WhatsApp link text
- middle-name suggestions and own-list ranking
- stats recording, the rejection of unknown events, and the password-protected stats page

`node tools/tests.js`: 31 failures, all already present in v41. None are new.

## v43b additions (same release, not yet pushed)
- **Bold "For entertainment only" notice** above the Rank button on the Name Checker and the 4 other tool pages, and at the top of every result.
- **Image card:** the footer line is now bold and larger ("For entertainment only. A symbolic reading, not a prediction.").
- **PDF report:** a bold notice under the title on page 1, and the closing method paragraph now starts "For entertainment only".
- **Mini widget (115 pages):** bold "For entertainment only" line.
- **Terms page:** new "Name Checker" section (entertainment only, not a statement about any real person or business, user decides how to use and share results, free to use).
- **Fixes:** duplicate theme script and stylesheet tags removed from 48 page heads; duplicate boy/girl FAQ removed from name-checker.html.
- **Everything stays free:** `api/name-checker-config.php` has `'paid' => false`, so ranking, full working, respellings, middle-name finder, PNG/JPG/PDF downloads, sharing and saved shortlists are all unlocked for everyone.
- Patch script: `tools/v43b_patch.py`.
