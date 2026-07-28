# Deployment checklist

1. In Hostinger File Manager, create `mnc_private` beside `public_html`, not inside it.
2. Copy `private-example/secrets.example.php` to `mnc_private/secrets.php` and replace every placeholder.
3. Use a long unique admin password. The example file converts it with `password_hash()` when loaded.
4. Add the Hostinger SMTP mailbox settings for `info@mynumerologycharts.com` and confirm SPF, DKIM and DMARC.
5. Upload all public release files to the correct domain's `public_html`. Do not upload `private-example` or the real `secrets.php` publicly.
6. Confirm PHP has PDO SQLite and OpenSSL enabled.
7. Open `/api/admin.php`. With missing secrets it must remain locked; with configured secrets it must accept the admin password.
8. Test the shared-header Sign up button. Wait at least three seconds, submit, receive the verification email and click its link.
9. Confirm the new record shows `VERIFIED` only after the link is clicked. Confirm CSV export contains verified records only.
10. Test the admin GDPR delete buttons for a test subscriber and a test contact message.
11. Run `node tools/submit-index.js /` only after deployment. Keep the IndexNow key file unchanged once live.
12. Test cookie controls, mobile navigation, chart calculations, printing and the real 404 response.

## Expected private structure

```text
mnc_private/
├── mnc.sqlite
├── mnc.sqlite-shm       # created automatically when needed
├── mnc.sqlite-wal       # created automatically when needed
└── secrets.php
```

`SQLite` is the database technology. `mnc_private` is the domain-specific private folder holding the database and secrets.
