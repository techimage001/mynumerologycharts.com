<?php
/*
  COPY THIS FILE BY HAND TO:

      mnc_private/secrets.php

  mnc_private sits BESIDE public_html, never inside it. Git deploys only
  write into public_html, so a file here survives every push and is not
  reachable over the web.

  Never commit the completed secrets.php to Git.
*/
return [

    /* Password for api/admin.php and api/health.php.
       Plain text is correct here. Avoid apostrophes: the value sits
       inside single quotes and an apostrophe will break the file. */
    'admin_password' => 'REPLACE-WITH-A-STRONG-ADMIN-PASSWORD',

    /* Random string, 32 characters or more. Used to hash IP addresses
       so raw addresses are never stored. Set it once and NEVER change
       it: changing it resets every stored counter. */
    'SITE_SALT'      => 'REPLACE-WITH-A-RANDOM-32-PLUS-CHARACTER-STRING',

    /* Where new sign-up notifications are delivered. */
    'NOTIFY_EMAIL'   => 'info@mynumerologycharts.com',

    /* Authenticated mailbox used for sending.
       smtp_pass is the MAILBOX password from hPanel -> Emails.
       It is not your hosting login and not admin_password above. */
    'smtp_host'      => 'smtp.hostinger.com',
    'smtp_port'      => 465,
    'smtp_secure'    => 'ssl',
    'smtp_user'      => 'info@mynumerologycharts.com',
    'smtp_pass'      => 'REPLACE-WITH-THE-MAILBOX-PASSWORD',

    /* from_email must match smtp_user: Hostinger rejects sends where the
       from address differs from the authenticated mailbox. */
    'from_email'     => 'info@mynumerologycharts.com',
    'from_name'      => 'MyNumerologyCharts',

];
