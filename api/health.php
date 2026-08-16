<?php
declare(strict_types=1);
require __DIR__ . '/config.php';

/*
  Configuration probe. Tells you exactly what is and is not set up,
  without ever revealing a secret value.

  Protected by the admin password: without it the page reveals nothing.
  Visit:  https://mynumerologycharts.com/api/health.php
*/

mnc_start_session();
if (isset($_POST['password']) && mnc_admin_password_matches((string)$_POST['password'])) {
    session_regenerate_id(true);
    $_SESSION['health'] = true;
}
if (isset($_POST['logout'])) { $_SESSION = []; session_destroy(); header('Location: health.php'); exit; }

header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex');

if (empty($_SESSION['health'])) {
    echo '<!doctype html><html lang="en-GB"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Setup check</title><style>body{font-family:system-ui;max-width:520px;margin:60px auto;padding:20px}label,input,button{display:block;width:100%;box-sizing:border-box;margin:.6rem 0;padding:.7rem}</style><h1>Setup check</h1><form method="post"><label>Admin password <input type="password" name="password" required autocomplete="current-password"></label><button>Continue</button></form></html>';
    exit;
}

$s = mnc_secrets();
$dir = mnc_private_dir();

$rows = [];
$rows[] = ['Private folder exists', is_dir($dir), $dir];
$rows[] = ['Private folder writable', is_dir($dir) && is_writable($dir), 'leads and contacts are stored here'];
$rows[] = ['secrets.php found', is_file($dir . '/secrets.php'), $dir . '/secrets.php'];
$rows[] = ['admin_password set', $s['admin_password'] !== '', 'accepts plain or hashed'];
$rows[] = ['SITE_SALT set', $s['site_salt'] !== '', 'never change this once live'];
$rows[] = ['smtp_host set', $s['smtp_host'] !== '', $s['smtp_host']];
$rows[] = ['smtp_port set', $s['smtp_port'] > 0, (string)$s['smtp_port'] . ' (' . $s['smtp_secure'] . ')'];
$rows[] = ['smtp_user set', $s['smtp_user'] !== '', $s['smtp_user']];
$rows[] = ['smtp_pass set', $s['smtp_pass'] !== '', $s['smtp_pass'] === '' ? 'missing' : 'set (' . strlen($s['smtp_pass']) . ' characters)'];
$rows[] = ['from_email set', $s['from_email'] !== '', $s['from_email']];
$rows[] = ['NOTIFY_EMAIL set', $s['notify_email'] !== '', $s['notify_email']];
$rows[] = ['SMTP ready', mnc_smtp_configured(), 'host, user and password all present'];

$dbOk = false; $dbNote = '';
try { mnc_db(); $dbOk = true; $dbNote = 'mnc.sqlite opened'; }
catch (Throwable $e) { $dbNote = $e->getMessage(); }
$rows[] = ['Database reachable', $dbOk, $dbNote];

$esc = static fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
echo '<!doctype html><html lang="en-GB"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Setup check</title><style>body{font-family:system-ui;max-width:900px;margin:40px auto;padding:20px;line-height:1.5}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px;text-align:left}.ok{color:#18723b;font-weight:700}.no{color:#9d1c1c;font-weight:700}form{margin-top:1.5rem}fieldset{margin-top:2rem;border:1px solid #ccc;padding:1rem}</style><h1>Setup check</h1><table><tr><th>Item</th><th>Status</th><th>Detail</th></tr>';
foreach ($rows as [$label, $ok, $note]) {
    echo '<tr><td>' . $esc($label) . '</td><td class="' . ($ok ? 'ok">OK' : 'no">Not set') . '</td><td>' . $esc($note) . '</td></tr>';
}
echo '</table>';

/* Live send test */
$testResult = null;
if (isset($_POST['test_to'])) {
    $to = filter_var(trim((string)$_POST['test_to']), FILTER_VALIDATE_EMAIL);
    if (!$to) {
        $testResult = [false, 'That is not a valid email address.'];
    } else {
        $err = null;
        $ok = mnc_smtp_send(
            $to,
            'MyNumerologyCharts test email',
            "This is a test email from MyNumerologyCharts.\n\nIf you can read this, authenticated SMTP is working correctly.\n\nSent: " . date(DATE_ATOM) . "\n"
        , $err);
        $testResult = [$ok, $ok ? 'Sent. Check the inbox and the spam folder.' : (string)$err];
    }
}
echo '<fieldset><legend>Send a test email</legend><p>Use an address at an outside provider such as Gmail or Outlook. Sending to your own domain stays on this server and proves nothing about deliverability.</p><form method="post"><input type="email" name="test_to" placeholder="you@gmail.com" required style="padding:.6rem;width:60%"> <button style="padding:.6rem 1rem">Send test</button></form>';
if ($testResult) {
    echo '<p class="' . ($testResult[0] ? 'ok' : 'no') . '">' . $esc($testResult[1]) . '</p>';
}
echo '</fieldset><form method="post"><button name="logout" value="1" style="padding:.5rem 1rem;width:auto">Sign out</button></form></html>';
