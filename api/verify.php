<?php
declare(strict_types=1);
require __DIR__ . '/config.php';

/*
  The link in the email. A valid, unexpired link marks the address verified,
  unlocks this browser with a secure cookie and returns the visitor to the
  page they signed up from. The link keeps working until it expires, so an
  email scanner opening it first cannot use it up.
*/

$email = filter_var(strtolower(trim((string)($_GET['email'] ?? ''))), FILTER_VALIDATE_EMAIL);
$token = (string)($_GET['token'] ?? '');
$back  = mnc_safe_return((string)($_GET['r'] ?? ''), '/app.html');

function verify_fail(string $title, string $message): never {
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    echo '<!doctype html><html lang="en-GB"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>' . htmlspecialchars($title) . '</title>'
       . '<style>body{font-family:system-ui;max-width:640px;margin:60px auto;padding:20px;line-height:1.6}a{color:#5b2d6f;font-weight:700}</style>'
       . '<h1>' . htmlspecialchars($title) . '</h1><p>' . htmlspecialchars($message) . '</p>'
       . '<p><a href="../app.html?signin=1">Request a new link</a></p><p><a href="../index.html">Return to MyNumerologyCharts</a></p></html>';
    exit;
}

if (!$email || !preg_match('/^[a-f0-9]{48}$/', $token)) verify_fail('Link not valid', 'This verification link is not complete. Copy the whole link from the email, or request a new one.');

try {
    $pdo = mnc_db();
    $st = $pdo->prepare('SELECT status,token_hash,token_expires_at,created_at,updated_at,page FROM subscribers WHERE email=?');
    $st->execute([$email]);
    $row = $st->fetch();
    if (!$row || empty($row['token_hash']) || !hash_equals((string)$row['token_hash'], hash('sha256', $token))) {
        verify_fail('Link not valid', 'This link is not valid, or a newer link has been sent since. Use the latest email, or request a new link.');
    }
    $expires = (int)($row['token_expires_at'] ?? 0);
    if ($expires === 0) { $expires = (int)strtotime((string)($row['updated_at'] ?: $row['created_at'])) + MNC_LINK_TTL; }
    if ($expires < time()) verify_fail('Link expired', 'This link has expired. Links work for 48 hours. Request a new one and it will arrive in a moment.');

    $firstTime = $row['status'] !== 'VERIFIED';
    if ($firstTime) {
        $pdo->prepare('UPDATE subscribers SET status="VERIFIED",verified_at=?,updated_at=? WHERE email=?')->execute([mnc_utc(), mnc_utc(), $email]);
        mnc_audit($pdo, 'email_verified', $email);
        $notify = filter_var(mnc_secrets()['notify_email'] ?? '', FILTER_VALIDATE_EMAIL);
        if ($notify) {
            @mnc_smtp_send($notify, 'New verified subscriber', "A new person confirmed their email on MyNumerologyCharts.\n\nEmail: $email\nSigned up from: " . ($row['page'] ?? $back) . "\nTime (UTC): " . mnc_utc() . "\n\nSee everyone at " . mnc_site_url() . "/api/admin.php\n");
        }
    } else {
        mnc_audit($pdo, 'device_signed_in', $email);
    }
    mnc_grant_access($pdo, $email);
} catch (Throwable $e) {
    error_log('MNC verify: ' . $e->getMessage());
    verify_fail('Something went wrong', 'We could not confirm your email just now. Please open the link again in a moment.');
}

header('Cache-Control: no-store');
header('Location: ' . $back . (str_contains($back, '?') ? '&' : '?') . 'verified=1', true, 302);
exit;
