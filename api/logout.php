<?php
declare(strict_types=1);
require __DIR__ . '/config.php';
/* Signs this browser out: deletes its session row and clears the cookie. */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') mnc_respond(405, 'Method not allowed', 'Use the Sign out button.', 'method');
if (!mnc_origin_ok()) mnc_respond(403, 'Request not accepted', 'This request was not accepted.', 'origin');
$raw = (string)($_COOKIE[MNC_ACCESS_COOKIE] ?? '');
try {
    if (preg_match('/^[a-f0-9]{64}$/', $raw)) {
        mnc_db()->prepare('DELETE FROM access_sessions WHERE session_hash=?')->execute([hash('sha256', $raw)]);
    }
} catch (Throwable $e) { error_log('MNC logout: ' . $e->getMessage()); }
mnc_clear_access_cookie();
mnc_respond(200, 'Signed out', 'This browser is signed out.', 'ok');
