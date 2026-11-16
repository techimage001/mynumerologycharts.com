<?php
declare(strict_types=1);
require __DIR__ . '/config.php';

/*
  Contact form. Store first, then send, then record whether the send worked,
  so a message is never lost if email is down. The recipient comes only from
  mnc_private/secrets.php; there is no address in this file.
  Works with or without JavaScript.
*/

if ($_SERVER['REQUEST_METHOD'] !== 'POST') mnc_respond(405, 'Method not allowed', 'Please use the contact form.', 'method');
if (!mnc_origin_ok()) mnc_respond(403, 'Request not accepted', 'This request was not accepted.', 'origin');

mnc_start_session();
$in = mnc_input();

if (trim((string)($in['website'] ?? '')) !== '') mnc_respond(200, 'Message received', 'Thank you. Your message has been received.', 'ok');

/* With JavaScript the hidden token and 3-second floor apply. Without it the
   form still works, protected by the other checks and the rate limit. */
$token = (string)($in['js_token'] ?? '');
if ($token !== '') {
    $expected = (string)($_SESSION['signup_js_token'] ?? '');
    if ($expected === '' || !hash_equals($expected, hash('sha256', $token))) {
        mnc_respond(400, 'Please try again', 'The secure form needs refreshing. Please try again.', 'token');
    }
    if ((int)round(microtime(true) * 1000) - (int)($_SESSION['signup_token_issued_ms'] ?? 0) < MNC_MIN_SUBMIT_MS) {
        mnc_respond(429, 'One moment', 'That was very quick. Please wait a moment and try again.', 'time_trap');
    }
}

$name    = mnc_header_safe((string)($in['name'] ?? ''), 80);
$email   = filter_var(strtolower(trim((string)($in['email'] ?? ''))), FILTER_VALIDATE_EMAIL);
$reason  = mnc_header_safe((string)($in['reason'] ?? 'General support'), 60);
$message = mb_substr(trim((string)($in['message'] ?? '')), 0, 3000);
$page    = mnc_safe_return((string)($in['page'] ?? '/contact.html'), '/contact.html');

if ($name === '' || $message === '') mnc_respond(422, 'Check the form', 'Please add your name and a message.', 'missing_fields');
if (!$email || strlen($email) > 160) mnc_respond(422, 'Check your email', 'Enter a valid email address so we can reply.', 'invalid_email');
if (mnc_disposable_domain($email)) mnc_respond(422, 'Use a permanent email', 'Please use a permanent email address so we can reply.', 'disposable');
if (!mnc_domain_receives_mail($email)) mnc_respond(422, 'Check the address', 'That email domain cannot receive mail. Check the spelling.', 'no_mx');

try {
    $pdo = mnc_db();
    if (!mnc_rate_limit($pdo, 'contact-ip', mnc_client_ip(), MNC_CONTACT_LIMIT_PER_IP, 3600)) {
        mnc_respond(429, 'Please wait', 'Too many messages from this connection. Please try again in a while.', 'rate_limited');
    }
    $pdo->prepare('INSERT INTO contacts(name,email,reason,message,page,ip_hash,sent,seen,created_at) VALUES(?,?,?,?,?,?,0,0,?)')
        ->execute([$name, $email, $reason, $message, $page, mnc_identity_hash(mnc_client_ip()), mnc_utc()]);
    $id = (int)$pdo->lastInsertId();
} catch (Throwable $e) {
    error_log('MNC contact store: ' . $e->getMessage());
    $pdo = null; $id = 0;
}

$sent = false;
$to = filter_var((string)(mnc_secrets()['contact_to'] ?? ''), FILTER_VALIDATE_EMAIL);
if (!$to) {
    error_log('MNC contact: Contact delivery is not configured. Add CONTACT_TO or NOTIFY_EMAIL to mnc_private/secrets.php.');
} else {
    $body = "New message from the MyNumerologyCharts contact form.\n\n"
          . "Name: $name\nEmail: $email\nReason: $reason\nPage: $page\nTime (UTC): " . mnc_utc() . "\n\n"
          . "Message:\n$message\n\n"
          . "Reply to this email to answer them directly.\n";
    $err = null;
    $sent = mnc_smtp_send($to, mnc_header_safe('Contact form: ' . $reason . ' from ' . $name, 150), $body, $err, $email);
    if ($sent && $pdo && $id) { $pdo->prepare('UPDATE contacts SET sent=1 WHERE id=?')->execute([$id]); }
}

if ($id || $sent) mnc_respond(200, 'Message received', 'Thank you. Your message has reached us and we will reply by email.', 'ok');
mnc_respond(503, 'Please try again', 'Sorry, we could not receive your message just now. Please try again shortly.', 'unavailable');
