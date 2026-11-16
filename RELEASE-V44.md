# Release v44: sign-in, download gate and email system to the Part G spec

## What changed for visitors
- **Sign in button in the header on every screen size**, including phones (beside the menu button). After confirming an email it becomes a round initial with the email, "Downloads and sharing are unlocked on this browser" and Sign out.
- **One sign-up box with three modes**: Welcome back (sign in on a new device), Create your account, and the download gate. Messages, Resend the link and Use a different email all stay inside the box. Visitors are returned to the page they were on.
- **Name Checker gate**: the ranking and working are always open. The first 3 downloads or shares on a device (PNG, JPG, PDF, Share, WhatsApp, Copy link) need nothing. The 4th opens "Keep saving and sharing". The first time it shows "Maybe later"; after that it stays. A quiet, dismissible invitation line appears from the second use.
- When the confirmation link is opened in another tab, the original tab unlocks by itself within a few seconds.
- Contact form now replies in place (and still works without JavaScript).
- Save and share panel laid out top to bottom at every width.
- "Free" removed from the Name Checker title, H1, description, FAQ, schema, notes, the mini widget and the sign-up box. Wording now: "No charge applies. No payment and no card details are ever requested."

## What changed on the server (api/)
- `subscribe.php`: JSON responses with a reason code for every outcome (origin, not_configured, token, time_trap, invalid_email, disposable, no_mx, rate_limited, send_failed, server_error). The 3-second check is measured on the server only (the old check compared the visitor's clock with the server's, which could reject every sign-up from a PC whose clock ran fast). A verified address that signs in again gets a fresh sign-in link instead of unlocking instantly.
- `verify.php`: 48-hour links; sets a secure httpOnly cookie (`mnc_access`); emails you when someone confirms for the first time; returns them to their page. The link keeps working until it expires, so email scanners cannot use it up.
- New `status.php` (the single source of truth for "is this browser unlocked") and `logout.php`.
- `unsubscribe.php`: signed with SITE_SALT; shows a confirm button, then deletes the address and its sign-ins outright. Every email now carries this link.
- `contact.php`: stores first, then sends, Reply-To set to the visitor, line breaks stripped from headers, honeypot, time trap, MX check, rate limit, no hard-coded address.
- `admin.php` (also `leads.php`): counters (verified, pending, total, verified today, unread messages), source page, UTC dates, Delete with confirmation, messages table, dated CSV with BOM (verified only).
- Database upgrades itself on first use. Existing subscribers and messages are kept. Retention: unconfirmed addresses 30 days, contact messages 12 months.
- `mnc_private/secrets.php` is unchanged and needs no edits.

## Files
New: `assets/signup.js`, `api/status.php`, `api/logout.php`, `api/leads.php`.
Changed: `api/config.php`, `api/smtp_mailer.php`, `api/form-token.php`, `api/subscribe.php`, `api/verify.php`, `api/unsubscribe.php`, `api/contact.php`, `api/admin.php`, `api/delete-account.php`, `api/nc-stats.php`, `assets/site.js` (old sign-up code removed), `assets/site.css`, `assets/name-checker-ui.js`, `assets/name-mini.js`, `assets/delete-account.js`, `site-profile.php` (blog header), privacy, cookie policy, terms, data-deletion, and every page (new script tag, asset versions v38).

## After pushing
1. Open any page: the Sign in button shows in the header on desktop and phone.
2. Sign up with a Gmail address, open the link, confirm the round initial appears.
3. Open `/api/admin.php`: your address shows as Verified with its source page.
