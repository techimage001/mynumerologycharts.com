<?php
declare(strict_types=1);
require __DIR__ . '/config.php';

/*
  Self-service deletion.

  Two steps, because sign-up is email-only with no password: typing an address
  must not be enough to delete that person's record. Step one emails a one-time
  link to the address itself; step two, opening that link, deletes the row
  outright and clears the browser session.

  Deletion is permanent and immediate. Nothing is flagged, archived or retained,
  which is what the privacy page promises.
*/

mnc_start_session();

function page_shell(string $title, string $body): never {
    header('Content-Type: text/html; charset=utf-8');
    header('X-Robots-Tag: noindex');
    echo '<!doctype html><html lang="en-GB"><meta name="viewport" content="width=device-width,initial-scale=1">'
       . '<title>' . htmlspecialchars($title) . '</title>'
       . '<style>body{font-family:system-ui;max-width:640px;margin:56px auto;padding:22px;line-height:1.6}'
       . 'a{color:#5b2d6f}input,button{font-size:16px;padding:.7rem;box-sizing:border-box}'
       . 'input{width:100%;margin:.5rem 0}button{cursor:pointer;border-radius:10px;border:0;background:#5b2d6f;color:#fff;padding:.8rem 1.4rem}'
       . '.warn{border-left:4px solid #9d1c1c;padding-left:14px}</style>'
       . '<h1>' . htmlspecialchars($title) . '</h1>' . $body
       . '<p><a href="../app.html">Return to MyNumerologyCharts</a></p></html>';
    exit;
}

/* ---------- step 2: the confirmation link was opened ---------- */
if (isset($_GET['token'], $_GET['email'])) {
    $email = filter_var(trim((string)$_GET['email']), FILTER_VALIDATE_EMAIL);
    $token = (string)$_GET['token'];
    if (!$email || $token === '') {
        page_shell('Link not valid', '<p>That deletion link is not valid. You can start again from the delete page.</p>');
    }
    try {
        $pdo = mnc_db();
        $stmt = $pdo->prepare('SELECT id, delete_token_hash, delete_expires_at FROM subscribers WHERE email = ?');
        $stmt->execute([strtolower($email)]);
        $row = $stmt->fetch();
        if (!$row || empty($row['delete_token_hash'])
            || !hash_equals((string)$row['delete_token_hash'], hash('sha256', $token))
            || (int)$row['delete_expires_at'] < time()) {
            page_shell('Link not valid or expired',
              '<p>That deletion link has already been used or has expired. Deletion links last 24 hours.</p>'
            . '<p>If your record still exists you can request a new link from the delete page.</p>');
        }
        $pdo->prepare('DELETE FROM subscribers WHERE id = ?')->execute([(int)$row['id']]);
        mnc_audit($pdo, 'account_deleted_by_user', 'self-service');
        $_SESSION = [];
        session_destroy();
        setcookie(session_name(), '', time() - 3600, '/');
        page_shell('Your record has been deleted',
          '<p>Your email address and every record attached to it have been permanently removed. Nothing was kept.</p>'
        . '<p>You will receive no further email from us. The tools remain free to use, and you can sign up again at any time if you want to.</p>');
    } catch (Throwable $e) {
        error_log('MNC delete: ' . $e->getMessage());
        page_shell('Something went wrong', '<p>We could not complete the deletion just now. Please try the link again shortly.</p>');
    }
}

/* ---------- step 1: request the link ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
    /* Always answer the same way, whether or not the address is on file.
       Otherwise this form becomes a way to test who has an account. */
    $neutral = '<p>If that address is on our records, a confirmation link is on its way to it. '
             . 'Open the link to complete the deletion. It lasts 24 hours.</p>'
             . '<p>Nothing has been deleted yet.</p>';
    if (!$email) page_shell('Check the address', '<p>That does not look like a valid email address. Please go back and try again.</p>');

    try {
        $pdo = mnc_db();
        $pdo->exec('ALTER TABLE subscribers ADD COLUMN delete_token_hash TEXT');
    } catch (Throwable $e) { /* column already exists */ }
    try { $pdo = $pdo ?? mnc_db(); $pdo->exec('ALTER TABLE subscribers ADD COLUMN delete_expires_at INTEGER'); }
    catch (Throwable $e) { /* already exists */ }

    try {
        $pdo = $pdo ?? mnc_db();
        if (!mnc_rate_limit($pdo, 'delete-ip', mnc_client_ip(), 6, 3600)) {
            page_shell('Please wait', '<p>Too many deletion requests from this connection. Please try again later.</p>');
        }
        $stmt = $pdo->prepare('SELECT id FROM subscribers WHERE email = ?');
        $stmt->execute([strtolower($email)]);
        $row = $stmt->fetch();
        if ($row) {
            $token = bin2hex(random_bytes(24));
            $pdo->prepare('UPDATE subscribers SET delete_token_hash = ?, delete_expires_at = ? WHERE id = ?')
                ->execute([hash('sha256', $token), time() + 86400, (int)$row['id']]);
            $url = 'https://mynumerologycharts.com/api/delete-account.php?token=' . urlencode($token)
                 . '&email=' . urlencode(strtolower($email));
            $body = "You asked to delete your MyNumerologyCharts record.\n\n"
                  . "Open this link to confirm. Deletion is permanent and cannot be undone:\n\n$url\n\n"
                  . "The link works for 24 hours. If you did not ask for this, ignore this email "
                  . "and nothing will be deleted.\n";
            mnc_smtp_send(strtolower($email), 'Confirm deletion of your record', $body);
            mnc_audit($pdo, 'account_delete_requested', '');
        }
        if (!empty($_POST['ajax'])) { header('Content-Type: application/json'); echo '{"ok":true}'; exit; }
        page_shell('Check your inbox', $neutral);
    } catch (Throwable $e) {
        error_log('MNC delete request: ' . $e->getMessage());
        if (!empty($_POST['ajax'])) { header('Content-Type: application/json'); echo '{"ok":true}'; exit; }
        page_shell('Check your inbox', $neutral);
    }
}

page_shell('Delete your record',
  '<div class="warn"><p><strong>This permanently deletes your email address and every record attached to it.</strong> '
. 'It cannot be undone, and nothing is kept.</p></div>'
. '<p>Enter the address you signed up with. We will email you a confirmation link, because we cannot delete a record on the word of whoever is typing.</p>'
. '<form method="post"><label for="e">Your email address</label>'
. '<input id="e" type="email" name="email" required autocomplete="email" placeholder="you@example.com">'
. '<button type="submit">Email me a deletion link</button></form>'
. '<p>The tools on this site stay free whether you have a record with us or not.</p>');
