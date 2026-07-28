# MyNumerologyCharts

Production-oriented numerology website and client-side chart application for `mynumerologycharts.com`.

## Build and test

```bash
node tools/build.js
node tools/tests.js
php -l api/config.php
php -l api/subscribe.php
php -l api/admin.php
php -l api/form-token.php
```

## Private storage

Upload the public release contents to `public_html`. Create a sibling directory named `mnc_private` outside `public_html`. The application stores its SQLite database as `mnc_private/mnc.sqlite` and reads all credentials from `mnc_private/secrets.php`.

Copy `private-example/secrets.example.php` to `mnc_private/secrets.php`, replace every placeholder, and never commit the real file. When secrets are missing, public static pages still load, sign-up reports that setup is incomplete, and the admin remains locked.

## Email and sign-up

The shared header contains a visible **Sign up** control. Sign-up is 100% free, requests no card details, and uses double opt-in. New records remain `PENDING` until the verification link is clicked. The admin shows `VERIFIED` and `PENDING`, while CSV export includes verified subscribers only.

Invisible first-party bot protection includes a honeypot, server-checked time trap, JavaScript/session token, IP and email rate limits, and a disposable-domain blocklist. No reCAPTCHA or Turnstile is used. Verification email is sent through authenticated SMTP configured in `mnc_private/secrets.php`.

The app contains no advertising or AdSense code. The cookie banner controls necessary storage and optional analytics; no analytics script is enabled by default.
