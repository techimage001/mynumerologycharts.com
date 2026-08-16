<?php
declare(strict_types=1);

require_once __DIR__ . '/smtp_mailer.php';

/* ------------------------------------------------------------------
   Tunables. Set a limit to 0 to switch it off entirely.
   These are deliberately generous so ordinary use, and your own
   testing, never trip them.
   ------------------------------------------------------------------ */
const MNC_SIGNUP_LIMIT_PER_IP    = 20;   // per window, per connection
const MNC_SIGNUP_WINDOW_IP       = 3600; // seconds
const MNC_SIGNUP_LIMIT_PER_EMAIL = 6;    // per window, per address
const MNC_SIGNUP_WINDOW_EMAIL    = 3600; // seconds
const MNC_MIN_SUBMIT_MS          = 3000; // timing floor for the invisible bot check

function mnc_private_dir(): string {
    $env = getenv('MNC_PRIVATE_DIR');
    return $env ?: dirname(__DIR__, 2) . '/mnc_private';
}

/* ------------------------------------------------------------------
   Secrets.

   The canonical format is the Card Maker Messages template:

       'admin_password' => '...',
       'SITE_SALT'      => '...',
       'NOTIFY_EMAIL'   => 'info@mynumerologycharts.com',
       'smtp_host'      => 'smtp.hostinger.com',
       'smtp_port'      => 465,
       'smtp_secure'    => 'ssl',
       'smtp_user'      => 'info@mynumerologycharts.com',
       'smtp_pass'      => '...',
       'from_email'     => 'info@mynumerologycharts.com',
       'from_name'      => 'MyNumerologyCharts',

   Older key spellings from earlier MyNumerologyCharts releases
   (smtp_username, smtp_password, rate_limit_pepper, admin_notify_email,
   contact_to) are still accepted, so an existing secrets.php keeps
   working without being rewritten.
   ------------------------------------------------------------------ */
function mnc_secrets(): array {
    static $cache = null;
    if (is_array($cache)) return $cache;

    $file = mnc_private_dir() . '/secrets.php';
    $raw  = is_file($file) ? (array) require $file : [];

    $pick = static function (array $src, array $keys, $default = '') {
        foreach ($keys as $k) {
            if (isset($src[$k]) && $src[$k] !== '') return $src[$k];
        }
        return $default;
    };

    $user = (string)$pick($raw, ['smtp_user', 'smtp_username']);
    $from = (string)$pick($raw, ['from_email'], $user);
    $port = (int)$pick($raw, ['smtp_port'], 465);

    $cache = [
        'admin_password' => (string)$pick($raw, ['admin_password']),
        'site_salt'      => (string)$pick($raw, ['SITE_SALT', 'site_salt', 'rate_limit_pepper']),
        'notify_email'   => (string)$pick($raw, ['NOTIFY_EMAIL', 'notify_email', 'admin_notify_email'], $from),
        'contact_to'     => (string)$pick($raw, ['contact_to', 'NOTIFY_EMAIL', 'notify_email'], $from),
        'smtp_host'      => (string)$pick($raw, ['smtp_host'], 'smtp.hostinger.com'),
        'smtp_port'      => $port,
        'smtp_secure'    => (string)$pick($raw, ['smtp_secure'], $port === 465 ? 'ssl' : 'tls'),
        'smtp_user'      => $user,
        'smtp_pass'      => (string)$pick($raw, ['smtp_pass', 'smtp_password']),
        'from_email'     => $from,
        'from_name'      => (string)$pick($raw, ['from_name'], 'MyNumerologyCharts'),
    ];
    return $cache;
}

/* True only when a real mailbox login is available. */
function mnc_smtp_configured(): bool {
    $s = mnc_secrets();
    return $s['smtp_host'] !== '' && $s['smtp_user'] !== '' && $s['smtp_pass'] !== '';
}

/*
  Accepts the admin password stored either as a plain string (the
  reference template format) or as a password_hash() digest (the format
  earlier releases used). Both verify correctly, so neither an old nor
  a new secrets.php locks you out.
*/
function mnc_admin_password_matches(string $candidate): bool {
    $stored = (string)(mnc_secrets()['admin_password'] ?? '');
    if ($stored === '' || $candidate === '') return false;
    if (preg_match('/^\$(2[aby]|argon2(i|d|id))\$/', $stored) === 1) {
        return password_verify($candidate, $stored);
    }
    return hash_equals($stored, $candidate);
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

/*
  Hashes an identifier with the site salt so raw IP addresses are never
  stored. The same visitor produces the same hash, but the hash is
  meaningless to anyone without the salt. This is why SITE_SALT must
  never change once the site is live.
*/
function mnc_identity_hash(string $value): string {
    $pepper = (string)(mnc_secrets()['site_salt'] ?? '');
    if ($pepper === '') $pepper = 'mynumerologycharts-rate-limit-v1';
    return hash_hmac('sha256', strtolower(trim($value)), $pepper);
}

function mnc_rate_limit(PDO $pdo, string $scope, string $identity, int $limit, int $windowSeconds): bool {
    if ($limit <= 0) return true; // limit switched off
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

/*
  Sends through authenticated SMTP. On failure it returns false and
  writes the real reason to the PHP error log, rather than failing
  silently the way unauthenticated mail() does.
*/
function mnc_smtp_send(string $to, string $subject, string $body, ?string &$error = null): bool {
    $s = mnc_secrets();
    if (!mnc_smtp_configured()) {
        $error = 'SMTP is not configured in mnc_private/secrets.php.';
        error_log('MyNumerologyCharts SMTP: ' . $error);
        return false;
    }
    $config = [
        'host'      => $s['smtp_host'],
        'port'      => $s['smtp_port'],
        'secure'    => $s['smtp_secure'],
        'user'      => $s['smtp_user'],
        'pass'      => $s['smtp_pass'],
        'from'      => $s['from_email'],
        'from_name' => $s['from_name'],
        'helo'      => 'mynumerologycharts.com',
    ];
    $sent = mnc_smtp_transmit($config, $to, $subject, $body, $error);
    if (!$sent) {
        error_log('MyNumerologyCharts SMTP error: ' . (string)$error);
    }
    return $sent;
}
