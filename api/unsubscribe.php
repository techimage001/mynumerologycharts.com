<?php
declare(strict_types=1);
require __DIR__ . '/config.php';

/*
  The link at the bottom of every email. It is signed with SITE_SALT, so only
  the person who received the email can use it. Opening it shows a
  confirmation button (email scanners open links on their own, and must not
  delete anyone); pressing it deletes the address outright, with nothing kept.
*/

function unsub_page(string $title, string $html): never {
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex');
    echo '<!doctype html><html lang="en-GB"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>' . htmlspecialchars($title) . '</title>'
       . '<style>body{font-family:system-ui;max-width:640px;margin:60px auto;padding:20px;line-height:1.6}a{color:#5b2d6f}button{font:inherit;font-weight:700;padding:.8rem 1.4rem;border:0;border-radius:10px;background:#5b2d6f;color:#fff;cursor:pointer}</style>'
       . '<h1>' . htmlspecialchars($title) . '</h1>' . $html . '<p><a href="../index.html">Return to MyNumerologyCharts</a></p></html>';
    exit;
}

$email = filter_var(strtolower(trim((string)($_REQUEST['email'] ?? ''))), FILTER_VALIDATE_EMAIL);
$t = (string)($_REQUEST['t'] ?? '');
if (!$email || mnc_secrets()['site_salt'] === '' || !preg_match('/^[a-f0-9]{64}$/', $t) || !hash_equals(mnc_unsub_token($email), $t)) {
    unsub_page('Link not valid', '<p>This unsubscribe link is not valid. Use the link at the bottom of one of our emails, or use our <a href="../contact.html">contact form</a> and we will remove you by hand.</p>');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $pdo = mnc_db();
        $pdo->prepare('DELETE FROM subscribers WHERE email=?')->execute([$email]);
        $pdo->prepare('DELETE FROM access_sessions WHERE email=?')->execute([$email]);
        mnc_audit($pdo, 'unsubscribed_deleted', '');
    } catch (Throwable $e) {
        error_log('MNC unsubscribe: ' . $e->getMessage());
        unsub_page('Please try again', '<p>We could not complete that just now. Please open the link again in a moment.</p>');
    }
    unsub_page('Your address has been deleted', '<p>Your email address has been permanently deleted from our records. Nothing was kept, and you will receive no further email from us.</p>');
}

unsub_page('Delete your email address?', '<p>This permanently deletes <strong>' . htmlspecialchars($email) . '</strong> from our records. You will receive no further email from us.</p>'
    . '<form method="post"><input type="hidden" name="email" value="' . htmlspecialchars($email) . '"><input type="hidden" name="t" value="' . htmlspecialchars($t) . '"><button type="submit">Delete my address</button></form>');
