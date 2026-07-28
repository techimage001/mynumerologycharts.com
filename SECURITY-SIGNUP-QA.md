# Security and Signup QA Report

## Page coverage
- HTML pages checked: 64
- Pages with visible shared-header Sign up control: 64
- Pages with sign-up modal: 64
- Pages with the bold 100% free/no-charge/no-card statement: 64

## Functional controls
- Double Opt In: PASS
- Honeypot: PASS
- Time Trap: PASS
- Js Session Token: PASS
- Rate Limit: PASS
- Disposable Block: PASS
- No Recaptcha: PASS
- No Turnstile: PASS
- Admin Verified Pending: PASS
- Verified Only Export: PASS
- Gdpr Delete: PASS
- Csrf: PASS
- Smtp: PASS
- Private Path: PASS
- Database Name: PASS
- Fail Safe Admin: PASS

## Storage
- Private folder: `mnc_private` outside `public_html`
- SQLite database file: `mnc_private/mnc.sqlite`
- Secrets file: `mnc_private/secrets.php` (not included in the release)

## Notes
- Server-side SMTP, SQLite and email delivery must be tested after Hostinger deployment because this build environment cannot connect to the live mailbox or hosting account.
- The shared header and sign-up component are intentionally repeated site chrome; content uniqueness testing excludes shared chrome.
