<?php
// Copy this file to mnc_private/secrets.php outside public_html.
// Never commit the real secrets.php file to Git.
return [
    'admin_password'   => password_hash('CHANGE-THIS-TO-A-LONG-UNIQUE-PASSWORD', PASSWORD_DEFAULT),
    'rate_limit_pepper'=> 'CHANGE-THIS-TO-A-LONG-RANDOM-SECRET',
    'smtp_host'        => 'smtp.hostinger.com',
    'smtp_port'        => 465,
    'smtp_username'    => 'info@mynumerologycharts.com',
    'smtp_password'    => 'PASTE-THE-MAILBOX-PASSWORD-HERE',
    'from_email'       => 'info@mynumerologycharts.com',
    'from_name'        => 'MyNumerologyCharts',
];
