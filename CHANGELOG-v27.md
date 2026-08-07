# MyNumerologyCharts v27 — Release summary

This release (v27) reverts the mobile comparison table to horizontal scrolling (the cleaner
solution): on phones the first column stays pinned and the other columns swipe into view, with
a visible scrollbar and a "swipe sideways" hint. Desktop is unchanged. All earlier v26 work
(signed-in account state, admin notification) is retained.

Naming convention going forward: every update increments the release number (v27, v28, ...).

---

# MyNumerologyCharts v27 — Release summary

This release (v27) builds on v24 and consolidates three pieces of work:

1. Signed-in account state — after clicking the verification link, the header shows a
   circular avatar + dropdown (email, "Every tool unlocked, free.", Sign out) instead of
   "Sign up". Device-unlock: entering the same email on another device unlocks instantly.
2. Admin notification — the site owner is emailed on every new signup.
3. Mobile comparison table — the table no longer clips its third column on phones; the
   first column stays pinned while the rest swipe into view.

Assets are cache-versioned v27 (the ?v= number is independent of the release name).

Full detail of each change is below.

---

# MyNumerologyCharts v27 — Signed-in account state

## New
- **Account header state.** After a visitor clicks their verification link, the browser
  remembers them. The "Sign up" button is replaced by a circular avatar (first letter of
  their email) with a dropdown showing their email, "Every tool unlocked, free." and "Sign out".
- **Device unlock.** "Already signed up? Enter the same email to unlock this device." A visitor
  who verified on another device can enter the same email in the signup modal; the server
  recognises them as already VERIFIED and unlocks the device instantly with no new email.
- **Admin notification.** Each new signup emails the site owner (from_email, or optional
  admin_notify_email in secrets.php) with the subscriber email, PENDING status and timestamp.

## Changed
- `api/verify.php` — on success, 302-redirects to `../app.html?verified=<email>` so the
  browser can record the signed-in state (site.js reads the flag then cleans the URL).
- `api/subscribe.php` — added already-verified device-unlock branch + admin notification.
- `assets/site.js` — account module: renders avatar/dropdown, sign-out, URL-flag handling.
- `assets/site.css` — account avatar + glassy dropdown styling (light/dark aware).
- All 425 HTML pages: asset cache version bumped `?v=20` → `?v=25`.

## Notes
- Signed-in state is per-device (localStorage), matching the passwordless magic-link model.
- No passwords, no CAPTCHA. Secrets still read at runtime from mnc_private/secrets.php.

## v27 patch — mobile comparison table
- Fixed: the comparison table's third column was cut off on phones with no way to scroll.
- `assets/site.css`: tables now scroll horizontally on mobile with a visible scrollbar,
  the first ("Feature") column stays pinned while columns 2-3 swipe into view, and cells
  are slightly tighter so more fits before scrolling. Desktop unchanged.
- `index.html`: added a "Swipe the table sideways to see more" hint (hidden on desktop).
- Asset cache bumped v26 -> v27. No other files or content changed.

## v28 patch — comparison table stacks on mobile
- Changed: on phones the comparison table now stacks into one card per feature, showing all
  three columns at once with labels ("MyNumerologyCharts", "Typical numerology tools") and no
  horizontal scrolling. Desktop keeps the normal three-column table.
- `assets/site.css`: replaced the horizontal-scroll rule with a stacked-card layout at <=600px.
- `index.html`: added data-label attributes to the table value cells so the stacked labels show.
- Asset cache bumped v27 -> v28.
