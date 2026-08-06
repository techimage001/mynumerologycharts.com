# v24 — contact form: no more 500, and it now emails you

Backend-only changes (HTML/logo/buttons unchanged from v23):

1. api/config.php mnc_db(): now AUTO-CREATES the mnc_private directory if it is
   missing (0755), instead of throwing a 500. Falls back to a clear error only
   if it cannot be created or written. This also fixes the signup form, which
   shares the same database.
2. api/contact.php: now EMAILS each submission to you via the existing SMTP
   mailer (mnc_smtp_send), in addition to saving it to the database. Wrapped in
   try/catch so a failure shows a friendly "please try again" message rather
   than a raw HTTP 500.

TO ACTUALLY RECEIVE THE EMAILS: put SMTP credentials in secrets.php inside
mnc_private (smtp_host, smtp_port, smtp_username, smtp_password, from_email,
and optionally contact_to for the recipient). Without SMTP set, submissions
still save to the database (readable in admin.php) and the form no longer errors.
