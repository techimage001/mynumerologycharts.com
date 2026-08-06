<?php
declare(strict_types=1);
require __DIR__ . '/config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') mnc_page('Method not allowed', 'Please use the signup form.');

// Honeypot: silently accept bot submissions without adding them.
if (!empty($_POST['website'] ?? '')) mnc_page('Thank you', 'Please check your email.');

mnc_start_session();
$started = filter_var($_POST['started'] ?? null, FILTER_VALIDATE_INT);
$elapsed = $started ? ((int)(microtime(true) * 1000) - $started) : 0;
if (!$started || $elapsed < 3000 || $elapsed > 7200000) {
    mnc_page('Please try again', 'The form was submitted too quickly or expired. Reopen the sign-up form and try again.');
}

$token = (string)($_POST['js_token'] ?? '');
$expected = (string)($_SESSION['signup_js_token'] ?? '');
$issued = (int)($_SESSION['signup_token_issued'] ?? 0);
unset($_SESSION['signup_js_token'], $_SESSION['signup_token_issued']);
if ($token === '' || $expected === '' || !hash_equals($expected, hash('sha256', $token)) || (time() - $issued) > 7200) {
    mnc_page('Please refresh', 'The secure form token is missing or expired. Refresh the page and try again.');
}

$email = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
if (!$email) mnc_page('Check your email', 'Enter a valid email address.');
$email = strtolower($email);
if (mnc_disposable_domain($email)) mnc_page('Use a permanent email', 'Disposable email addresses are not accepted. Please use an address you can keep and verify.');

try {
    $pdo = mnc_db();
    if (!mnc_rate_limit($pdo, 'signup-ip', mnc_client_ip(), 8, 900) || !mnc_rate_limit($pdo, 'signup-email', $email, 4, 3600)) {
        mnc_page('Please wait', 'Too many sign-up attempts were received. Please try again later.');
    }

    // Already verified on another device: unlock this device immediately, no new email needed.
    $check = $pdo->prepare('SELECT status FROM subscribers WHERE email=?');
    $check->execute([$email]);
    if ($check->fetchColumn() === 'VERIFIED') {
        mnc_audit($pdo, 'device_unlock', $email);
        header('Location: ../app.html?verified=' . urlencode($email), true, 302);
        exit;
    }

    $verificationToken = bin2hex(random_bytes(24));
    $hash = hash('sha256', $verificationToken);
    $now = date(DATE_ATOM);
    $stmt = $pdo->prepare('INSERT INTO subscribers(email,status,token_hash,created_at,verified_at) VALUES(?,"PENDING",?,?,NULL) ON CONFLICT(email) DO UPDATE SET token_hash=excluded.token_hash,status="PENDING",created_at=excluded.created_at,verified_at=NULL');
    $stmt->execute([$email, $hash, $now]);
    mnc_audit($pdo, 'signup_pending', $email);

    $link = 'https://mynumerologycharts.com/api/verify.php?token=' . urlencode($verificationToken) . '&email=' . urlencode($email);
    $subject = 'Verify your MyNumerologyCharts email';
    $body = "Confirm your MyNumerologyCharts sign-up by opening this link:\n\n$link\n\nYour address counts as verified only after you click the link. Nothing is charged and no card details are requested.\n\nIf you did not request this, ignore this email.";
    if (!mnc_smtp_send($email, $subject, $body)) {
        mnc_audit($pdo, 'verification_email_failed', $email);
        mnc_page('Email setup required', 'Your request was saved as pending, but the verification email could not be sent. The site owner must complete SMTP settings in mnc_private/secrets.php.');
    }
    mnc_audit($pdo, 'verification_email_sent', $email);

    // Notify the site owner of the new signup (does not affect the visitor's flow).
    $secrets = mnc_secrets();
    $adminNotify = filter_var((string)($secrets['admin_notify_email'] ?? ($secrets['from_email'] ?? '')), FILTER_VALIDATE_EMAIL);
    if ($adminNotify) {
        $adminSubject = 'New MyNumerologyCharts sign-up: ' . $email;
        $adminBody = "A new person signed up on MyNumerologyCharts.\n\nEmail: $email\nStatus: PENDING (awaiting their click on the verification link)\nTime: $now\n\nThey appear as VERIFIED in api/admin.php once they click their link.";
        if (!mnc_smtp_send($adminNotify, $adminSubject, $adminBody)) {
            mnc_audit($pdo, 'admin_notify_failed', $email);
        }
    }

    mnc_page('Check your inbox', 'Open the verification email and click its link. Your address is not counted as verified until that step is complete.');
} catch (Throwable $e) {
    mnc_page('Sign-up unavailable', 'The secure private storage is not configured yet. Please try again after deployment setup is complete.');
}
