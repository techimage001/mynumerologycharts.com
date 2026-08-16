<?php
declare(strict_types=1);
require __DIR__ . '/config.php';
mnc_start_session();
$secrets = mnc_secrets();
$expected = (string)($secrets['admin_password'] ?? '');

if (isset($_POST['logout'])) { session_regenerate_id(true); $_SESSION = []; session_destroy(); header('Location: admin.php'); exit; }
if (isset($_POST['password']) && mnc_admin_password_matches((string)$_POST['password'])) {
    session_regenerate_id(true);
    $_SESSION['admin'] = true;
    $_SESSION['csrf'] = bin2hex(random_bytes(24));
}
if (empty($_SESSION['admin'])) {
    echo '<!doctype html><html lang="en-GB"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin</title><style>body{font-family:system-ui;max-width:520px;margin:60px auto;padding:20px}label,input,button{display:block;width:100%;box-sizing:border-box;margin:.6rem 0;padding:.7rem}</style><h1>MyNumerologyCharts Admin</h1>';
    if ($expected === '') echo '<p>Admin is locked because no admin_password is set in mnc_private/secrets.php.</p>';
    else echo '<form method="post"><label>Password <input type="password" name="password" required autocomplete="current-password"></label><button>Sign in</button></form>';
    echo '</html>'; exit;
}

$pdo = mnc_db();
$csrf = (string)($_SESSION['csrf'] ?? '');
if ($_SERVER['REQUEST_METHOD'] === 'POST' && (isset($_POST['delete_subscriber']) || isset($_POST['delete_contact']))) {
    if (!hash_equals($csrf, (string)($_POST['csrf'] ?? ''))) { http_response_code(403); exit('Invalid request token.'); }
    if (isset($_POST['delete_subscriber'])) {
        $id = filter_var($_POST['delete_subscriber'], FILTER_VALIDATE_INT);
        if ($id) { $pdo->prepare('DELETE FROM subscribers WHERE id=?')->execute([$id]); mnc_audit($pdo, 'admin_gdpr_delete_subscriber', 'id=' . $id); }
    }
    if (isset($_POST['delete_contact'])) {
        $id = filter_var($_POST['delete_contact'], FILTER_VALIDATE_INT);
        if ($id) { $pdo->prepare('DELETE FROM contacts WHERE id=?')->execute([$id]); mnc_audit($pdo, 'admin_gdpr_delete_contact', 'id=' . $id); }
    }
    header('Location: admin.php'); exit;
}

if (isset($_GET['export'])) {
    mnc_audit($pdo, 'admin_export_verified');
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="verified-subscribers.csv"');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['email', 'verified_at']);
    foreach ($pdo->query('SELECT email,verified_at FROM subscribers WHERE status="VERIFIED" ORDER BY verified_at DESC') as $row) fputcsv($out, $row);
    exit;
}

$subs = $pdo->query('SELECT id,email,status,created_at,verified_at FROM subscribers ORDER BY id DESC')->fetchAll();
$contacts = $pdo->query('SELECT id,name,email,reason,message,created_at FROM contacts ORDER BY id DESC LIMIT 200')->fetchAll();
$esc = static fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
echo '<!doctype html><html lang="en-GB"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MyNumerologyCharts Admin</title><style>body{font-family:system-ui;max-width:1200px;margin:auto;padding:20px}table{border-collapse:collapse;width:100%;margin-bottom:2rem}td,th{border:1px solid #ccc;padding:8px;text-align:left;vertical-align:top}.VERIFIED{color:#18723b;font-weight:700}.PENDING{color:#9a5a00;font-weight:700}.top{display:flex;gap:1rem;align-items:center;flex-wrap:wrap}button{padding:.45rem .7rem}.danger{color:#9d1c1c}</style><div class="top"><h1>Admin</h1><a href="?export=1">Export verified subscribers only</a><form method="post"><button name="logout" value="1">Sign out</button></form></div><h2>Subscribers</h2><table><tr><th>Email</th><th>Status</th><th>Created</th><th>Verified</th><th>GDPR action</th></tr>';
foreach ($subs as $r) {
    echo '<tr><td>' . $esc($r['email']) . '</td><td class="' . $esc($r['status']) . '">' . $esc($r['status']) . '</td><td>' . $esc($r['created_at']) . '</td><td>' . $esc($r['verified_at'] ?? '') . '</td><td><form method="post" onsubmit="return confirm(\'Permanently delete this subscriber?\')"><input type="hidden" name="csrf" value="' . $esc($csrf) . '"><button class="danger" name="delete_subscriber" value="' . (int)$r['id'] . '">Delete permanently</button></form></td></tr>';
}
echo '</table><h2>Contact messages</h2><table><tr><th>Name</th><th>Email</th><th>Reason</th><th>Message</th><th>Date</th><th>GDPR action</th></tr>';
foreach ($contacts as $r) {
    echo '<tr><td>' . $esc($r['name']) . '</td><td>' . $esc($r['email']) . '</td><td>' . $esc($r['reason']) . '</td><td>' . nl2br($esc($r['message'])) . '</td><td>' . $esc($r['created_at']) . '</td><td><form method="post" onsubmit="return confirm(\'Permanently delete this message?\')"><input type="hidden" name="csrf" value="' . $esc($csrf) . '"><button class="danger" name="delete_contact" value="' . (int)$r['id'] . '">Delete permanently</button></form></td></tr>';
}
echo '</table></html>';
