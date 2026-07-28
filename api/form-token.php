<?php
declare(strict_types=1);
require __DIR__ . '/config.php';
mnc_start_session();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$token = bin2hex(random_bytes(24));
$_SESSION['signup_js_token'] = hash('sha256', $token);
$_SESSION['signup_token_issued'] = time();
echo json_encode(['token' => $token], JSON_UNESCAPED_SLASHES);
