<?php
/* Anonymous usage counts for the Name Checker.
   POST e=<event>&src=<page>&m=<mode>  ->  +1 on today's total.
   No cookies, no names, no dates, no IP addresses stored with the totals.
   A scrambled connection hash is kept for 24 hours only, by the existing
   rate limiter, so nobody can inflate the numbers. */
declare(strict_types=1);
require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }

$events = ['rank','middle_suggest','middle_rank','save_png','save_jpg','save_pdf','share_native','share_whatsapp','share_copy','share_open','signup_click', 'gate_shown','preview','save_device'];
$e   = (string)($_POST['e'] ?? '');
$src = substr(preg_replace('/[^a-z0-9-]/', '', strtolower((string)($_POST['src'] ?? 'unknown'))) ?: 'unknown', 0, 60);
$m   = in_array($_POST['m'] ?? '', ['baby','middle','business','married','own'], true) ? (string)$_POST['m'] : '';
if (!in_array($e, $events, true)) { http_response_code(400); echo '{"ok":false}'; exit; }

try {
    $pdo = mnc_db();
    $pdo->exec('CREATE TABLE IF NOT EXISTS nc_stats(day TEXT NOT NULL, event TEXT NOT NULL, src TEXT NOT NULL, mode TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(day,event,src,mode))');
    if (!mnc_rate_limit($pdo, 'nc-stats', mnc_client_ip(), 300, 3600)) { echo '{"ok":true}'; exit; }
    $st = $pdo->prepare('INSERT INTO nc_stats(day,event,src,mode,n) VALUES(?,?,?,?,1) ON CONFLICT(day,event,src,mode) DO UPDATE SET n=n+1');
    $st->execute([gmdate('Y-m-d'), $e, $src, $m]);
} catch (Throwable $ex) { /* never break the page for a counter */ }
echo '{"ok":true}';
