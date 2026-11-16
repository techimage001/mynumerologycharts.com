<?php
declare(strict_types=1);
require __DIR__ . '/config.php';

/*
  Email capture. One insert, then one send. Every outcome returns a status,
  a plain-English message and a reason code, so nothing fails silently.
  Signing in on a new device works the same way: we email a fresh link to the
  address, and opening it unlocks that browser.
*/

if ($_SERVER['REQUEST_METHOD'] !== 'POST') mnc_respond(405, 'Method not allowed', 'Please use the sign-up form.', 'method');
if (!mnc_origin_ok()) mnc_respond(403, 'Request not accepted', 'This request was not accepted.', 'origin');

$s = mnc_secrets();
if ($s['site_salt'] === '' || !mnc_smtp_configured()) {
    mnc_respond(503, 'Not ready yet', 'Email verification is not configured yet.', 'not_configured');
}

mnc_start_session();
$in = mnc_input();

/* Honeypot: bots get a neutral success and nothing is stored. */
if (trim((string)($in['website'] ?? $in['company'] ?? '')) !== '') {
    mnc_respond(200, 'Check your inbox', 'Check your inbox and open the verification link.', 'ok');
}

/* Hidden token and the 3-second floor, both measured on the server. */
$token = (string)($in['js_token'] ?? '');
$expected = (string)($_SESSION['signup_js_token'] ?? '');
if ($token === '' || $expected === '' || !hash_equals($expected, hash('sha256', $token))) {
    mnc_respond(400, 'Please try again', 'The secure form needs refreshing. Please try again.', 'token');
}
$elapsed = (int)round(microtime(true) * 1000) - (int)($_SESSION['signup_token_issued_ms'] ?? 0);
if ($elapsed < MNC_MIN_SUBMIT_MS) {
    mnc_respond(429, 'One moment', 'That was very quick. Please wait a moment and try again.', 'time_trap');
}

$email = filter_var(strtolower(trim((string)($in['email'] ?? ''))), FILTER_VALIDATE_EMAIL);
if (!$email || strlen($email) > 160) mnc_respond(422, 'Check your email', 'Enter a valid email address.', 'invalid_email');
if (mnc_disposable_domain($email)) mnc_respond(422, 'Use a permanent email', 'Please use a permanent email address you can keep.', 'disposable');
if (!mnc_domain_receives_mail($email)) mnc_respond(422, 'Check the address', 'That email domain cannot receive mail. Check the spelling.', 'no_mx');

$page = mnc_safe_return((string)($in['page'] ?? ''), '/app.html');

try {
    $pdo = mnc_db();
    if (!mnc_rate_limit($pdo, 'signup-ip', mnc_client_ip(), MNC_SIGNUP_LIMIT_PER_IP, MNC_SIGNUP_WINDOW_IP)
        || !mnc_rate_limit($pdo, 'signup-email', $email, MNC_SIGNUP_LIMIT_PER_EMAIL, MNC_SIGNUP_WINDOW_EMAIL)) {
        mnc_audit($pdo, 'signup_rate_limited', $email);
        mnc_respond(429, 'Please wait', 'Too many attempts just now. Please wait a few minutes and try again.', 'rate_limited');
    }

    mnc_retention($pdo);
    $raw = bin2hex(random_bytes(24));
    $now = mnc_utc();
    $st = $pdo->prepare('SELECT status FROM subscribers WHERE email=?');
    $st->execute([$email]);
    $existing = $st->fetchColumn();
    $returning = $existing === 'VERIFIED';

    if ($existing === false) {
        $pdo->prepare('INSERT INTO subscribers(email,status,token_hash,token_expires_at,created_at,updated_at,page,ip_hash,verified_at) VALUES(?,"PENDING",?,?,?,?,?,?,NULL)')
            ->execute([$email, hash('sha256', $raw), time() + MNC_LINK_TTL, $now, $now, $page, mnc_identity_hash(mnc_client_ip())]);
    } else {
        /* A verified address stays verified; it just gets a fresh link. */
        $pdo->prepare('UPDATE subscribers SET token_hash=?,token_expires_at=?,updated_at=?,page=COALESCE(page,?) WHERE email=?')
            ->execute([hash('sha256', $raw), time() + MNC_LINK_TTL, $now, $page, $email]);
    }

    $link = mnc_site_url() . '/api/verify.php?email=' . rawurlencode($email) . '&token=' . $raw . '&r=' . rawurlencode($page);
    $subject = $returning ? 'Your MyNumerologyCharts sign-in link' : 'Confirm your email address';
    $body = "Hello,\n\n"
          . ($returning
              ? "Open the private link below to sign in and unlock MyNumerologyCharts downloads and sharing on this browser:\n\n"
              : "Open the private link below to confirm your email and unlock unlimited MyNumerologyCharts downloads and sharing on this browser:\n\n")
          . $link . "\n\n"
          . "The link works for 48 hours. Nothing is charged and no payment-card details are requested.\n\n"
          . "If you did not request this email, ignore it and nothing will happen.\n\n"
          . "Delete this address from our records:\n" . mnc_unsub_url($email) . "\n";

    $err = null;
    if (!mnc_smtp_send($email, $subject, $body, $err)) {
        mnc_audit($pdo, 'signup_send_failed', (string)$err);
        mnc_respond(503, 'Email not sent', 'We could not send the email just now. Please try again in a few minutes.', 'send_failed');
    }
    mnc_audit($pdo, $returning ? 'signin_link_sent' : 'signup_link_sent', $page);
    mnc_respond(200, 'Check your inbox', 'Check your inbox and open the verification link.', 'ok', ['email' => $email, 'returning' => $returning]);
} catch (Throwable $e) {
    error_log('MNC subscribe: ' . $e->getMessage());
    mnc_respond(500, 'Sign-up unavailable', 'Something went wrong on our side. Please try again shortly.', 'server_error');
}
