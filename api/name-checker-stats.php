<?php
/* Name Checker usage: https://mynumerologycharts.com/api/name-checker-stats.php
   Protected by the same admin password as api/health.php (from secrets.php). */
declare(strict_types=1);
require __DIR__ . '/config.php';

mnc_start_session();
if (isset($_POST['password']) && mnc_admin_password_matches((string)$_POST['password'])) {
    session_regenerate_id(true);
    $_SESSION['nc_stats'] = true;
}
header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');

$style = '<style>body{font-family:system-ui;max-width:980px;margin:40px auto;padding:0 18px;color:#241d2b;line-height:1.5}h1{margin:.2em 0}table{border-collapse:collapse;width:100%;margin:12px 0 28px}th,td{padding:8px 10px;border-bottom:1px solid #ded4c9;text-align:left}th{background:#efe8df}td.n{text-align:right;font-variant-numeric:tabular-nums}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:16px 0 26px}.cards div{border:1px solid #ded4c9;border-radius:14px;padding:14px}.cards b{display:block;font-size:1.8rem;color:#5b2d6f}small,.muted{color:#675d6d}form.p{max-width:360px}input,button{font:inherit;padding:10px;width:100%;box-sizing:border-box;margin:6px 0}select{font:inherit;padding:6px}</style>';

if (empty($_SESSION['nc_stats'])) {
    echo '<!doctype html><html lang="en-GB"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Name Checker stats</title>' . $style . '<h1>Name Checker stats</h1><form class="p" method="post"><label>Admin password <input type="password" name="password" required autocomplete="current-password"></label><button>Continue</button></form></html>';
    exit;
}

$days = in_array((int)($_GET['days'] ?? 30), [7, 30, 90, 365], true) ? (int)$_GET['days'] : 30;
$since = gmdate('Y-m-d', time() - ($days - 1) * 86400);
$rows = $bySrc = $byDay = [];
try {
    $pdo = mnc_db();
    $pdo->exec('CREATE TABLE IF NOT EXISTS nc_stats(day TEXT NOT NULL, event TEXT NOT NULL, src TEXT NOT NULL, mode TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(day,event,src,mode))');
    $q = $pdo->prepare('SELECT event, SUM(n) t FROM nc_stats WHERE day >= ? GROUP BY event');
    $q->execute([$since]);
    foreach ($q as $r) { $rows[$r['event']] = (int)$r['t']; }
    $q = $pdo->prepare("SELECT src, SUM(CASE WHEN event IN ('rank','middle_suggest','middle_rank') THEN n ELSE 0 END) uses, SUM(CASE WHEN event LIKE 'save_%' OR event='preview' THEN n ELSE 0 END) saves, SUM(CASE WHEN event LIKE 'share_%' AND event<>'share_open' THEN n ELSE 0 END) shares FROM nc_stats WHERE day >= ? GROUP BY src ORDER BY uses DESC LIMIT 40");
    $q->execute([$since]); $bySrc = $q->fetchAll();
    $q = $pdo->prepare("SELECT day, SUM(CASE WHEN event IN ('rank','middle_suggest','middle_rank') THEN n ELSE 0 END) uses, SUM(CASE WHEN event LIKE 'share_%' AND event<>'share_open' THEN n ELSE 0 END) shares, SUM(CASE WHEN event='share_open' THEN n ELSE 0 END) opens FROM nc_stats WHERE day >= ? GROUP BY day ORDER BY day DESC");
    $q->execute([$since]); $byDay = $q->fetchAll();
} catch (Throwable $e) { $err = 'The private folder could not be opened. Check api/health.php.'; }

$h = static fn($s) => htmlspecialchars((string)$s, ENT_QUOTES);
$g = static fn($k) => $rows[$k] ?? 0;
$uses = $g('rank') + $g('middle_suggest') + $g('middle_rank');
$saves = $g('save_png') + $g('save_jpg') + $g('save_pdf') + $g('save_device');
$shares = $g('share_native') + $g('share_whatsapp') + $g('share_copy');

echo '<!doctype html><html lang="en-GB"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Name Checker stats</title>' . $style;
echo '<h1>Name Checker stats</h1><p class="muted">Anonymous daily totals. No names, dates or personal details are recorded.</p>';
echo '<form method="get">Show the last <select name="days" onchange="this.form.submit()">';
foreach ([7, 30, 90, 365] as $o) { echo '<option value="' . $o . '"' . ($o === $days ? ' selected' : '') . '>' . $o . ' days</option>'; }
echo '</select></form>';
if (!empty($err)) { echo '<p><strong>' . $h($err) . '</strong></p>'; }
echo '<div class="cards"><div><b>' . $uses . '</b>times used</div><div><b>' . $saves . '</b>downloads and saves</div><div><b>' . $shares . '</b>shares</div><div><b>' . $g('share_open') . '</b>shared links opened</div><div><b>' . $g('signup_click') . '</b>signup clicks</div></div>';
echo '<h2>By action</h2><table><tr><th>Action</th><th>Total</th></tr>';
$labels = ['rank' => 'Ranked names', 'middle_suggest' => 'Middle-name suggestions', 'middle_rank' => 'Ranked own middle names', 'preview' => 'Previewed image', 'save_png' => 'Downloaded PNG', 'save_jpg' => 'Downloaded JPG', 'save_pdf' => 'Downloaded PDF', 'save_device' => 'Saved on device', 'share_native' => 'Shared (phone menu)', 'share_whatsapp' => 'Shared to WhatsApp', 'share_copy' => 'Copied link', 'share_open' => 'Opened a shared link', 'signup_click' => 'Clicked signup'];
foreach ($labels as $k => $l) { echo '<tr><td>' . $h($l) . '</td><td class="n">' . $g($k) . '</td></tr>'; }
echo '</table><h2>Which pages send users</h2><table><tr><th>Page</th><th>Uses</th><th>Saves</th><th>Shares</th></tr>';
foreach ($bySrc as $r) { echo '<tr><td>' . $h($r['src']) . '</td><td class="n">' . (int)$r['uses'] . '</td><td class="n">' . (int)$r['saves'] . '</td><td class="n">' . (int)$r['shares'] . '</td></tr>'; }
if (!$bySrc) { echo '<tr><td colspan="4" class="muted">Nothing yet.</td></tr>'; }
echo '</table><h2>By day</h2><table><tr><th>Day</th><th>Uses</th><th>Shares</th><th>Shared links opened</th></tr>';
foreach ($byDay as $r) { echo '<tr><td>' . $h($r['day']) . '</td><td class="n">' . (int)$r['uses'] . '</td><td class="n">' . (int)$r['shares'] . '</td><td class="n">' . (int)$r['opens'] . '</td></tr>'; }
if (!$byDay) { echo '<tr><td colspan="4" class="muted">Nothing yet.</td></tr>'; }
echo '</table></html>';
