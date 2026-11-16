<?php
declare(strict_types=1);
require __DIR__ . '/config.php';
/* Is this browser unlocked? The single source of truth for the front end. */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
try {
    $email = mnc_current_access(mnc_db());
} catch (Throwable $e) {
    error_log('MNC status: ' . $e->getMessage());
    echo json_encode(['verified' => false, 'email' => null, 'reason' => 'server_error']);
    exit;
}
if ($email === null && isset($_COOKIE[MNC_ACCESS_COOKIE])) mnc_clear_access_cookie();
echo json_encode(['verified' => $email !== null, 'email' => $email], JSON_UNESCAPED_SLASHES);
