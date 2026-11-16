<?php
declare(strict_types=1);
require __DIR__ . '/config.php';

/*
  Admin dashboard. Signed in with admin_password from mnc_private/secrets.php,
  never through the email system, so it keeps working when mail is down.
  Bookmark: https://mynumerologycharts.com/api/admin.php
*/

mnc_start_session();
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
$secrets = mnc_secrets();
$configured = (string)($secrets['admin_password'] ?? '') !== '';
$e = static fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
$css = '<style>body{font-family:system-ui,sans-serif;max-width:1200px;margin:auto;padding:20px;color:#241d2b}h1{margin:.2rem 0}'
     . '.top{display:flex;gap:1rem;align-items:center;flex-wrap:wrap;justify-content:space-between}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:18px 0}'
     . '.card{border:1px solid #ded4c9;border-radius:12px;padding:14px;background:#fdfaf6}.card b{display:block;font-size:1.8rem;color:#5b2d6f}.card span{color:#675d6d;font-size:.9rem}'
     . 'table{border-collapse:collapse;width:100%;margin-bottom:2rem;font-size:.92rem}td,th{border:1px solid #ddd;padding:8px;text-align:left;vertical-align:top}th{background:#f6f1ea}'
     . '.ok{color:#18723b;font-weight:700}.pending{color:#8a8290}.msg{background:#e9f6ee;border-left:4px solid #18723b;padding:10px 14px;margin:12px 0}'
     . 'button,.btn{font:inherit;padding:.5rem .8rem;border-radius:8px;border:1px solid #ccc;background:#fff;cursor:pointer;text-decoration:none;color:#241d2b;display:inline-block}'
     . '.primary{background:#5b2d6f;color:#fff;border-color:#5b2d6f}.danger{color:#9d1c1c}.note{color:#675d6d;font-size:.9rem}td.m{white-space:pre-wrap;max-width:420px}.new{font-weight:700}'
     . 'form.login label,form.login input,form.login button{display:block;width:100%;box-sizing:border-box;margin:.6rem 0;padding:.7rem}</style>';
$shell = static fn(string $title, string $body) => '<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>' . $title . '</title>' . $css . $body . '</html>';

if (isset($_POST['logout'])) { $_SESSION = []; session_destroy(); header('Location: admin.php'); exit; }

$loginError = '';
if (isset($_POST['password'])) {
    if ($configured && mnc_admin_password_matches((string)$_POST['password'])) {
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        $_SESSION['csrf'] = bin2hex(random_bytes(24));
        header('Location: admin.php'); exit;
    }
    $loginError = '<p class="danger">Incorrect password</p>';
}
if (empty($_SESSION['admin'])) {
    $body = '<div style="max-width:440px;margin:60px auto"><h1>MyNumerologyCharts admin</h1>';
    $body .= $configured
        ? $loginError . '<form class="login" method="post"><label for="pw">Password</label><input id="pw" type="password" name="password" required autocomplete="current-password"><button class="primary">Sign in</button></form>'
        : '<p>Admin access is not configured. Add admin_password to mnc_private/secrets.php.</p>';
    echo $shell('Admin sign in', $body . '</div>'); exit;
}

try { $pdo = mnc_db(); } catch (Throwable $ex) {
    echo $shell('Admin', '<h1>Admin</h1><p class="danger">The database could not be opened: ' . $e($ex->getMessage()) . '</p><p>Open api/health.php for the full setup check.</p>'); exit;
}
$csrf = (string)($_SESSION['csrf'] ?? '');

/* Retention promised on the privacy page. */
mnc_retention($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && (isset($_POST['delete_subscriber']) || isset($_POST['delete_contact']))) {
    if (!hash_equals($csrf, (string)($_POST['csrf'] ?? ''))) { http_response_code(403); exit('Invalid request token. Reload the page and try again.'); }
    if ($id = filter_var($_POST['delete_subscriber'] ?? null, FILTER_VALIDATE_INT)) {
        $st = $pdo->prepare('SELECT email FROM subscribers WHERE id=?'); $st->execute([$id]); $em = $st->fetchColumn();
        $pdo->prepare('DELETE FROM subscribers WHERE id=?')->execute([$id]);
        if ($em) $pdo->prepare('DELETE FROM access_sessions WHERE email=?')->execute([$em]);
        mnc_audit($pdo, 'admin_delete_subscriber', 'id=' . $id);
        $_SESSION['flash'] = 'Subscriber deleted permanently.';
    }
    if ($id = filter_var($_POST['delete_contact'] ?? null, FILTER_VALIDATE_INT)) {
        $pdo->prepare('DELETE FROM contacts WHERE id=?')->execute([$id]);
        mnc_audit($pdo, 'admin_delete_contact', 'id=' . $id);
        $_SESSION['flash'] = 'Message deleted permanently.';
    }
    header('Location: admin.php'); exit;
}

$iso = static function ($v): string { $t = strtotime((string)$v); return $t ? gmdate('Y-m-d\TH:i:s\Z', $t) : ''; };

if (isset($_GET['export'])) {
    mnc_audit($pdo, 'admin_export_verified');
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="verified-subscribers-' . gmdate('Y-m-d') . '.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, ['Email', 'Status', 'Source page', 'Date (UTC)']);
    foreach ($pdo->query('SELECT email,page,verified_at FROM subscribers WHERE status="VERIFIED" ORDER BY verified_at DESC') as $r) {
        fputcsv($out, [$r['email'], 'Verified', (string)($r['page'] ?? ''), $iso($r['verified_at'])]);
    }
    exit;
}

$count = static fn(string $sql, array $p = []) => (function () use ($pdo, $sql, $p) { $st = $pdo->prepare($sql); $st->execute($p); return (int)$st->fetchColumn(); })();
$verified = $count('SELECT COUNT(*) FROM subscribers WHERE status="VERIFIED"');
$pending  = $count('SELECT COUNT(*) FROM subscribers WHERE status<>"VERIFIED"');
$total    = $verified + $pending;
$today    = 0;
foreach ($pdo->query('SELECT verified_at FROM subscribers WHERE status="VERIFIED"') as $r) { if (($t = strtotime((string)$r['verified_at'])) && $t >= time() - 86400) $today++; }
$unread   = $count('SELECT COUNT(*) FROM contacts WHERE COALESCE(seen,0)=0');

$flash = (string)($_SESSION['flash'] ?? ''); unset($_SESSION['flash']);

$h = '<div class="top"><h1>MyNumerologyCharts admin</h1><form method="post"><button name="logout" value="1">Sign out</button></form></div>';
if ($flash !== '') $h .= '<p class="msg">' . $e($flash) . '</p>';
$h .= '<div class="cards">'
    . '<div class="card"><b>' . $verified . '</b><span>Verified emails</span></div>'
    . '<div class="card"><b>' . $pending . '</b><span>Pending verification</span></div>'
    . '<div class="card"><b>' . $total . '</b><span>Total submitted</span></div>'
    . '<div class="card"><b>' . $today . '</b><span>Verified today</span></div>'
    . '<div class="card"><b>' . $unread . '</b><span>Unread messages</span></div></div>';

$h .= '<div class="top"><h2>Subscribers</h2><a class="btn primary" href="?export=1">Download verified CSV</a></div>'
    . '<p class="note">Only verified subscribers are included in the CSV export.</p>';
$rows = $pdo->query('SELECT id,email,status,page,created_at,verified_at FROM subscribers ORDER BY COALESCE(verified_at,created_at) DESC')->fetchAll();
if (!$rows) {
    $h .= '<p>No subscribers have been recorded yet.</p>';
} else {
    $h .= '<table><tr><th>Email</th><th>Status</th><th>Source page</th><th>Date (UTC)</th><th>Action</th></tr>';
    foreach ($rows as $r) {
        $ok = $r['status'] === 'VERIFIED';
        $h .= '<tr><td>' . $e($r['email']) . '</td><td class="' . ($ok ? 'ok' : 'pending') . '">' . ($ok ? 'Verified' : 'Pending') . '</td>'
            . '<td>' . $e($r['page'] ?? '') . '</td><td>' . $e($iso($ok ? $r['verified_at'] : $r['created_at'])) . '</td>'
            . '<td><form method="post" onsubmit="return confirm(\'Permanently delete this subscriber?\')"><input type="hidden" name="csrf" value="' . $e($csrf) . '"><button class="danger" name="delete_subscriber" value="' . (int)$r['id'] . '">Delete</button></form></td></tr>';
    }
    $h .= '</table>';
}

$h .= '<h2>Messages</h2><p class="note">From the contact form. Never added to the subscriber list or the export. Kept for 12 months.</p>';
$msgs = $pdo->query('SELECT id,name,email,reason,message,created_at,COALESCE(seen,0) seen,COALESCE(sent,0) sent FROM contacts ORDER BY created_at DESC')->fetchAll();
if (!$msgs) {
    $h .= '<p>No messages have been received yet.</p>';
} else {
    $h .= '<table><tr><th>Date (UTC)</th><th>Name</th><th>Email</th><th>Reason</th><th>Message</th><th>Action</th></tr>';
    foreach ($msgs as $m) {
        $h .= '<tr' . ($m['seen'] ? '' : ' class="new"') . '><td>' . $e($iso($m['created_at'])) . ($m['sent'] ? '' : '<br><span class="note">not emailed</span>') . '</td><td>' . $e($m['name']) . '</td><td>' . $e($m['email']) . '</td><td>' . $e($m['reason']) . '</td>'
            . '<td class="m">' . $e($m['message']) . '</td>'
            . '<td><form method="post" onsubmit="return confirm(\'Permanently delete this message?\')"><input type="hidden" name="csrf" value="' . $e($csrf) . '"><button class="danger" name="delete_contact" value="' . (int)$m['id'] . '">Delete</button></form></td></tr>';
    }
    $h .= '</table>';
    $pdo->exec('UPDATE contacts SET seen=1 WHERE COALESCE(seen,0)=0');
}
echo $shell('MyNumerologyCharts admin', $h);
