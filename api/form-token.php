<?php
declare(strict_types=1);
require __DIR__ . '/config.php';
/*
  Issues the hidden form token when a page loads. The time it was issued is
  kept on the server, so the 3-second bot check never depends on the
  visitor's clock, and reopening the sign-up box does not restart it.
*/
mnc_start_session();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$nowMs = (int)round(microtime(true) * 1000);
$issued = (int)($_SESSION['signup_token_issued_ms'] ?? 0);
if (empty($_SESSION['signup_js_token_raw']) || $issued === 0 || $nowMs - $issued > 7000000) {
    $token = bin2hex(random_bytes(24));
    $_SESSION['signup_js_token_raw'] = $token;
    $_SESSION['signup_js_token'] = hash('sha256', $token);
    $_SESSION['signup_token_issued_ms'] = $nowMs;
}
echo json_encode(['token' => $_SESSION['signup_js_token_raw'], 'started' => (int)$_SESSION['signup_token_issued_ms']], JSON_UNESCAPED_SLASHES);
