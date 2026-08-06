# MyNumerologyCharts v25 — Signed-in account state

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
