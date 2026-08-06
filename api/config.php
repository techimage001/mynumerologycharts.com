<?php
declare(strict_types=1);

function mnc_private_dir(): string {
    $env = getenv('MNC_PRIVATE_DIR');
    return $env ?: dirname(__DIR__, 2) . '/mnc_private';
}

function mnc_secrets(): array {
    $file = mnc_private_dir() . '/secrets.php';
    return is_file($file) ? (array) require $file : [];
}

function mnc_start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => $secure,
        'samesite' => 'Lax',
        'path' => '/',
    ]);
    session_start();
}

function mnc_db(): PDO {
    $dir = mnc_private_dir();
    if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
    if (!is_dir($dir) || !is_writable($dir)) {
        throw new RuntimeException('Private directory is not writable. Create mnc_private outside public_html with write permission.');
    }
    $pdo = new PDO('sqlite:' . $dir . '/mnc.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA journal_mode=WAL');
    $pdo->exec('CREATE TABLE IF NOT EXISTS subscribers(id INTEGER PRIMARY KEY,email TEXT UNIQUE NOT NULL,status TEXT NOT NULL CHECK(status IN ("PENDING","VERIFIED")),token_hash TEXT,created_at TEXT NOT NULL,verified_at TEXT)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS contacts(id INTEGER PRIMARY KEY,name TEXT,email TEXT,reason TEXT,message TEXT,created_at TEXT NOT NULL)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS rate_limits(id INTEGER PRIMARY KEY,scope TEXT NOT NULL,identity_hash TEXT NOT NULL,created_at INTEGER NOT NULL)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(scope,identity_hash,created_at)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS audit_log(id INTEGER PRIMARY KEY,action TEXT NOT NULL,details TEXT,created_at TEXT NOT NULL)');
    return $pdo;
}

function mnc_page(string $title, string $message): never {
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="en-GB"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' . htmlspecialchars($title) . '</title><style>body{font-family:system-ui;max-width:720px;margin:60px auto;padding:20px;line-height:1.6}a{color:#5b2d6f}</style><h1>' . htmlspecialchars($title) . '</h1><p>' . htmlspecialchars($message) . '</p><p><a href="../app.html">Return to MyNumerologyCharts</a></p></html>';
    exit;
}

function mnc_client_ip(): string {
    return (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

function mnc_identity_hash(string $value): string {
    $secrets = mnc_secrets();
    $pepper = (string)($secrets['rate_limit_pepper'] ?? 'mynumerologycharts-rate-limit-v1');
    return hash_hmac('sha256', strtolower(trim($value)), $pepper);
}

function mnc_rate_limit(PDO $pdo, string $scope, string $identity, int $limit, int $windowSeconds): bool {
    $now = time();
    $cutoff = $now - $windowSeconds;
    $hash = mnc_identity_hash($identity);
    $pdo->prepare('DELETE FROM rate_limits WHERE created_at < ?')->execute([$now - 86400]);
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM rate_limits WHERE scope=? AND identity_hash=? AND created_at>=?');
    $stmt->execute([$scope, $hash, $cutoff]);
    if ((int)$stmt->fetchColumn() >= $limit) return false;
    $pdo->prepare('INSERT INTO rate_limits(scope,identity_hash,created_at) VALUES(?,?,?)')->execute([$scope, $hash, $now]);
    return true;
}

function mnc_disposable_domain(string $email): bool {
    $domain = strtolower((string)substr(strrchr($email, '@') ?: '', 1));
    $blocked = [
        '10minutemail.com','10minutemail.net','guerrillamail.com','guerrillamail.net',
        'mailinator.com','maildrop.cc','temp-mail.org','tempmail.com','throwawaymail.com',
        'yopmail.com','yopmail.fr','sharklasers.com','getnada.com','dispostable.com',
        'trashmail.com','fakeinbox.com','mintemail.com','emailondeck.com'
    ];
    return in_array($domain, $blocked, true);
}

function mnc_audit(PDO $pdo, string $action, string $details = ''): void {
    $pdo->prepare('INSERT INTO audit_log(action,details,created_at) VALUES(?,?,?)')
        ->execute([$action, $details, date(DATE_ATOM)]);
}

function mnc_smtp_send(string $to, string $subject, string $body): bool {
    $s = mnc_secrets();
    $host = (string)($s['smtp_host'] ?? '');
    $port = (int)($s['smtp_port'] ?? 587);
    $user = (string)($s['smtp_username'] ?? '');
    $pass = (string)($s['smtp_password'] ?? '');
    $from = (string)($s['from_email'] ?? 'info@mynumerologycharts.com');
    $fromName = (string)($s['from_name'] ?? 'MyNumerologyCharts');
    if ($host === '' || $user === '' || $pass === '') return false;

    $transport = $port === 465 ? 'ssl://' . $host : $host;
    $socket = @stream_socket_client($transport . ':' . $port, $errno, $errstr, 15, STREAM_CLIENT_CONNECT);
    if (!$socket) return false;
    stream_set_timeout($socket, 15);
    $read = static function() use ($socket): string {
        $out = '';
        while (($line = fgets($socket, 515)) !== false) {
            $out .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') break;
        }
        return $out;
    };
    $cmd = static function(string $command, array $ok) use ($socket, $read): bool {
        fwrite($socket, $command . "\r\n");
        $reply = $read();
        return in_array((int)substr($reply, 0, 3), $ok, true);
    };
    $reply = $read();
    if ((int)substr($reply, 0, 3) !== 220) { fclose($socket); return false; }
    if (!$cmd('EHLO mynumerologycharts.com', [250])) { fclose($socket); return false; }
    if ($port !== 465) {
        if (!$cmd('STARTTLS', [220])) { fclose($socket); return false; }
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) { fclose($socket); return false; }
        if (!$cmd('EHLO mynumerologycharts.com', [250])) { fclose($socket); return false; }
    }
    if (!$cmd('AUTH LOGIN', [334]) || !$cmd(base64_encode($user), [334]) || !$cmd(base64_encode($pass), [235])) { fclose($socket); return false; }
    if (!$cmd('MAIL FROM:<' . $from . '>', [250]) || !$cmd('RCPT TO:<' . $to . '>', [250,251]) || !$cmd('DATA', [354])) { fclose($socket); return false; }
    $headers = [
        'Date: ' . date(DATE_RFC2822),
        'From: ' . $fromName . ' <' . $from . '>',
        'To: <' . $to . '>',
        'Subject: ' . $subject,
        'Message-ID: <' . bin2hex(random_bytes(12)) . '@mynumerologycharts.com>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];
    $safeBody = preg_replace('/^\./m', '..', $body) ?? $body;
    fwrite($socket, implode("\r\n", $headers) . "\r\n\r\n" . $safeBody . "\r\n.\r\n");
    $reply = $read();
    $ok = (int)substr($reply, 0, 3) === 250;
    $cmd('QUIT', [221]);
    fclose($socket);
    return $ok;
}
