# Email setup — MyNumerologyCharts v26

The email stack now uses the same secrets format and the same authenticated
SMTP approach as the Card Maker Messages reference build.

Nothing outside `api/` changed. All 425 pages, `app.html`, `assets/`,
`data/` and `tools/` are byte-identical to v25.

## 1. Create the private folder

In Hostinger File Manager, go to the level that shows `public_html`
(you should also see `.builds` and `DO_NOT_UPLOAD_HERE` there).

Create, BESIDE `public_html`, never inside it:

    mnc_private

Result:

    .builds/
    mnc_private/        <- you create this; Git never touches it
    public_html/        <- Git deploys here and replaces it
    DO_NOT_UPLOAD_HERE

Git deployment only writes into `public_html`, so `secrets.php` and the
subscriber database survive every push. Nothing at this level is reachable
over the web either, so `secrets.php` has no URL.

## 2. Create secrets.php

Copy `private-example/secrets.example.php` to `mnc_private/secrets.php`
and fill in three values:

| Key | What to put |
|---|---|
| `admin_password` | Plain text. Used for `api/admin.php` and `api/health.php` |
| `SITE_SALT` | 32+ random characters. Set once, NEVER change it |
| `smtp_pass` | The MAILBOX password for `info@mynumerologycharts.com` |

No apostrophes in any value: they sit inside single quotes and an
apostrophe breaks the file.

`smtp_user` and `from_email` must be the same address, and that mailbox must
exist in hPanel -> Emails. Hostinger rejects sends where the from address
differs from the authenticated mailbox.

An existing secrets.php using the older key names (`smtp_username`,
`smtp_password`, `rate_limit_pepper`, a hashed `admin_password`) still works
unchanged. Both formats are accepted.

## 3. Check the setup

Open `https://mynumerologycharts.com/api/health.php` and sign in with your
admin password. It shows a green or red line for every required item, and
it never displays a secret value.

From the same page, send a test email. Use a Gmail or Outlook address:
sending to your own domain stays on the server and proves nothing about
deliverability.

If the test fails, the page shows the real SMTP reason (wrong password,
connection refused, rejected sender) instead of failing silently.

## 4. Test the real journey

1. Open `app.html` in a private window.
2. Trigger the sign-up gate.
3. Wait at least 3 seconds before submitting.
4. Confirm the verification email arrives.
5. Open the link. It returns you to the app as verified.
6. Confirm `NOTIFY_EMAIL` receives the new sign-up notification.
7. Check `api/admin.php` shows the address as VERIFIED.

## 5. Deliverability

In hPanel, confirm SPF and DKIM are enabled for the domain, and add DMARC.

## What changed from v25

| File | Change |
|---|---|
| `api/smtp_mailer.php` | NEW. Standalone SMTP sender, reports the real failure reason |
| `api/health.php` | NEW. Password-protected setup check and test-send page |
| `api/config.php` | Reference secrets format, old keys still accepted, limits moved to named constants |
| `api/subscribe.php` | Logs the real send failure, clearer messages, uses NOTIFY_EMAIL |
| `api/admin.php` | Accepts a plain or hashed admin_password |
| `api/contact.php` | Uses the normalised contact recipient |
| `private-example/secrets.example.php` | Rewritten to the reference format |

## Sign-up limits

Set in `api/config.php` at the top. Raised from the v25 values, which were
tight enough to lock you out during your own testing:

    MNC_SIGNUP_LIMIT_PER_IP    = 20   (was 8 per 15 minutes)
    MNC_SIGNUP_LIMIT_PER_EMAIL = 6    (was 4 per hour)

Set either to `0` to switch that limit off entirely.

These are invisible to visitors. There is no CAPTCHA and no third-party
service anywhere in this stack.

## Known issue, not addressed here

Your `public_html` currently receives the whole repository, including a
`.git` folder, `tools/` and the `.md` files. A reachable `.git` directory
lets anyone download your full source history. Worth closing separately.
