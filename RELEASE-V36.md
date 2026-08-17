# v36 — theme bug, self-service deletion, zodiac diagrams

457 pages. Includes v27 to v35. One zip, all three corrections.

## 1. The theme flipping on every click — FIXED

This was a real bug, not a preference setting. The handler read:

    d.querySelector('[data-theme]')?.addEventListener('click', ...)

The inline head script sets data-theme on <html> when a theme is saved. So
document.querySelector('[data-theme]') matched the <html> element rather than
the toggle button, and the click listener was attached to the whole document.
From then on, every click anywhere on the page flipped the theme.

That also explains the timing: it only started after you used the toggle once,
because until a theme is saved <html> has no data-theme and the selector finds
the button correctly.

Fix: the button now carries data-theme-toggle, which cannot collide with the
attribute on <html>, and the handler is scoped to it. aria-pressed is also set
and kept in sync, which it was not before.

Verified: clicking the H1, the hamburger, the body and a link all leave the
theme unchanged. The toggle works, and the choice persists across pages.

## 2. Delete My Data replaced with self-service account deletion

You were right that handling deletion requests by hand is a liability. The
footer link now reads Delete My Account and leads to a page with a button
rather than instructions.

New: api/delete-account.php. Two steps, because sign-up here is email-only with
no password, so typing an address must not be enough to delete that record:

  1. Enter your address. A one-time link is emailed to that address.
  2. Opening the link deletes the row outright and clears the browser session.

Deliberate details worth knowing:

  - The page gives the SAME answer whether or not the address is on file.
    Otherwise the form becomes a way to test who has an account here.
  - The link lasts 24 hours and works once. Opening it deletes the record,
    which invalidates the token.
  - Deletion is a DELETE, not a flag. No archive, no retention period. That is
    what the privacy page already promised.
  - Rate limited to 6 requests per hour per connection.
  - The token is stored as a SHA-256 hash, never in plain text.

data-deletion.html rewritten from "how to ask us" to "here is the button", with
five FAQs covering permanence, why confirmation is needed, link expiry, why we
will not confirm whether an address exists, and whether the tools still work.

One thing I kept rather than removed: the contact route. UK GDPR gives a right
to erasure whether or not someone can open their inbox, so a person locked out
of their email still needs a way through. It is now the fallback rather than
the only path.

## 3. Zodiac diagrams

114 pages now carry a sign diagram: the traditional glyph plus a stylised star
pattern, drawn as paths and circles. Code-drawn, theme-aware, nothing traced or
licensed, same approach as the palm diagrams.

    12  zodiac sign pages
    36  horoscope, love horoscope and career horoscope pages
    66  compatibility pages, showing both signs side by side

The caption calls the star pattern stylised, which is accurate: the
arrangements are approximate rather than survey-accurate positions, and saying
so is better than implying an astronomical claim the drawing does not support.

## QA

    0 failures across 457 pages
    0 pages carrying the old data-theme button attribute
    0 pages still reading Delete My Data
    all PHP parses, all JSON-LD parses, 0 broken relative links
    drift 0 at 390px on every page checked
    asset version v=31 sitewide

## Not verified

iOS Safari, still. ios-check.html is in this build and remains the way to
close that.

The deletion flow was verified by code inspection and PHP lint, not by a live
send, since SMTP needs your real mailbox credentials. Test it once after
deploying: request a link with a throwaway address that has signed up, confirm
the email arrives, open the link, then check api/admin.php shows the record
gone.

## Deploy

Upload, hard refresh, run tools/submit-index.js. No secrets change.

## ADDENDUM — one-click deletion from the account

The first version only served someone who was NOT signed in: it asked them to
type their address. That missed the obvious case, and it is now fixed.

data-deletion.html carries a Delete my account panel at the top. If this
browser has an account stored, the address is shown and there is nothing to
type: one button, one confirm, done. If not, a single email field appears.

What happens on click:

  - Saved charts and account data on THIS DEVICE are cleared immediately and
    unconditionally: mnc-account, mnc-profiles, mnc-use, mnc-app and session
    storage. That data belongs to the device and needs nobody's permission.
  - The server record is deleted when the emailed confirmation link is opened.

### Why the email step cannot be removed

I looked at how the unlock actually works before answering this. verify.php
sets no server session cookie; the verified state lives in localStorage under
mnc-account, which is client-side only and editable by anyone.

So the server has no way to tell who is asking. A one-click server-side delete
would let anyone delete any address they typed. The emailed link is the only
identity check this architecture has.

If you want genuinely instant server-side deletion with no email, the change
needed is upstream: verify.php sets an httpOnly session cookie, delete-account
trusts that cookie, and the gate reads server state rather than localStorage.
That is a real change to the sign-up flow and should be its own release rather
than bolted on here.

Verified in-browser: signed in, the address is pre-filled and the manual field
hidden; the confirm dialog appears; all three local keys are wiped; the status
reports what was cleared and the button reads Done. Signed out, the manual
field appears instead. Zero page errors.
