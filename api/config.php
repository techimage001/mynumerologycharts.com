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
const MNC_CONTACT_LIMIT_PER_IP   = 10;   // contact messages per hour per connection (0 = off)
const MNC_LINK_TTL               = 172800; // verification links last 48 hours
const MNC_ACCESS_TTL             = 34560000; // unlock cookie lasts 400 days
const MNC_ACCESS_COOKIE          = 'mnc_access';
/* The public address of the site. Used to build links in emails, so a forged
   Host header can never point a verification link somewhere else. */
const MNC_SITE_URL               = 'https://mynumerologycharts.com';

function mnc_private_dir(): string {
    $env = getenv('MNC_PRIVATE_DIR');
    return $env ?: dirname(__DIR__, 2) . '/mnc_private';
}

/* ------------------------------------------------------------------
   Secrets.

   The canonical format is the Card Maker Messages template:

       'admin_password' => '...',
       'SITE_SALT'      => '...',
       'NOTIFY_EMAIL'   => 'info@example.com',
       'smtp_host'      => 'smtp.hostinger.com',
       'smtp_port'      => 465,
       'smtp_secure'    => 'ssl',
       'smtp_user'      => 'info@example.com',
       'smtp_pass'      => '...',
       'from_email'     => 'info@example.com',
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
    $pdo->exec('CREATE TABLE IF NOT EXISTS access_sessions(id INTEGER PRIMARY KEY,session_hash TEXT UNIQUE NOT NULL,email TEXT NOT NULL,created_at TEXT NOT NULL,expires_at INTEGER NOT NULL)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_access_email ON access_sessions(email)');
    /* Add newer columns to databases created by earlier releases. Existing
       subscribers and messages are kept exactly as they are. */
    mnc_add_columns($pdo, 'subscribers', ['page' => 'TEXT', 'updated_at' => 'TEXT', 'ip_hash' => 'TEXT', 'token_expires_at' => 'INTEGER']);
    mnc_add_columns($pdo, 'contacts', ['page' => 'TEXT', 'ip_hash' => 'TEXT', 'sent' => 'INTEGER DEFAULT 0', 'seen' => 'INTEGER DEFAULT 0']);
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
function mnc_smtp_send(string $to, string $subject, string $body, ?string &$error = null, string $replyTo = ''): bool {
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
        'reply_to'  => $replyTo,
    ];
    $sent = mnc_smtp_transmit($config, $to, $subject, $body, $error);
    if (!$sent) {
        error_log('MyNumerologyCharts SMTP error: ' . (string)$error);
    }
    return $sent;
}

function mnc_add_columns(PDO $pdo, string $table, array $columns): void {
    $have = [];
    foreach ($pdo->query('PRAGMA table_info(' . $table . ')') as $col) { $have[strtolower((string)$col['name'])] = true; }
    foreach ($columns as $name => $type) {
        if (!isset($have[strtolower($name)])) { $pdo->exec('ALTER TABLE ' . $table . ' ADD COLUMN ' . $name . ' ' . $type); }
    }
}

/* ---------- JSON or page responses ---------- */
function mnc_wants_json(): bool {
    $accept = (string)($_SERVER['HTTP_ACCEPT'] ?? '');
    $type   = (string)($_SERVER['CONTENT_TYPE'] ?? '');
    return stripos($accept, 'application/json') !== false || stripos($type, 'application/json') !== false;
}

/* Reads a JSON body when one was sent, otherwise the ordinary form fields. */
function mnc_input(): array {
    $type = (string)($_SERVER['CONTENT_TYPE'] ?? '');
    if (stripos($type, 'application/json') !== false) {
        $data = json_decode((string)file_get_contents('php://input'), true);
        return is_array($data) ? $data : [];
    }
    return $_POST;
}

/* Every outcome returns a status, a plain-English message and a reason code.
   JSON callers get JSON; a plain form post gets a real page. */
function mnc_respond(int $status, string $title, string $message, string $reason = 'ok', array $extra = []): never {
    http_response_code($status);
    header('Cache-Control: no-store');
    if (mnc_wants_json()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $status < 300, 'reason' => $reason, 'title' => $title, 'message' => $message] + $extra, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
    mnc_page($title, $message);
}

/* A request from another website is refused. Requests with no Origin header
   (plain form posts from older browsers) are allowed through. */
function mnc_origin_ok(): bool {
    $origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin === '' || $origin === 'null') return true;
    $host = strtolower((string)parse_url($origin, PHP_URL_HOST));
    $self = strtolower((string)preg_replace('/:\d+$/', '', (string)($_SERVER['HTTP_HOST'] ?? '')));
    $site = strtolower((string)parse_url(MNC_SITE_URL, PHP_URL_HOST));
    return $host !== '' && ($host === $self || $host === $site || $host === 'www.' . $site);
}

function mnc_site_url(): string {
    $env = getenv('MNC_SITE_URL');
    return rtrim($env ?: MNC_SITE_URL, '/');
}

/* True when the domain can receive mail. Fails open if DNS lookups are unavailable. */
function mnc_domain_receives_mail(string $email): bool {
    if (getenv('MNC_SKIP_MX')) return true;
    $domain = (string)substr(strrchr($email, '@') ?: '', 1);
    if ($domain === '' || !function_exists('checkdnsrr')) return true;
    return checkdnsrr($domain . '.', 'MX') || checkdnsrr($domain . '.', 'A');
}

/* Removes line breaks from anything that will touch an email header. */
function mnc_header_safe(string $value, int $max = 200): string {
    return mb_substr(trim((string)preg_replace('/[\r\n\t]+/', ' ', $value)), 0, $max);
}

/* Only same-site paths are allowed as a return address. */
function mnc_safe_return(string $path, string $fallback = '/app.html'): string {
    $path = trim($path);
    if ($path === '' || $path[0] !== '/' || str_starts_with($path, '//') || preg_match('/[\s\\<>"\']/', $path)) return $fallback;
    $parts = explode('#', $path, 2)[0];
    [$p, $q] = array_pad(explode('?', $parts, 2), 2, '');
    if (!preg_match('~^/[A-Za-z0-9._\-/]*$~', $p) || str_contains($p, '..') || str_starts_with($p, '/api/')) return $fallback;
    parse_str($q, $params);
    unset($params['verified'], $params['signin'], $params['signup']);
    $q = http_build_query($params);
    return $p . ($q !== '' ? '?' . $q : '');
}

/* ---------- signed unsubscribe links ---------- */
function mnc_unsub_token(string $email): string {
    $salt = (string)(mnc_secrets()['site_salt'] ?? '');
    return hash_hmac('sha256', 'unsubscribe|' . strtolower(trim($email)), $salt);
}
function mnc_unsub_url(string $email): string {
    return mnc_site_url() . '/api/unsubscribe.php?email=' . rawurlencode(strtolower($email)) . '&t=' . mnc_unsub_token($email);
}

/* ---------- the unlock cookie ---------- */
function mnc_cookie_secure(): bool {
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
}

function mnc_grant_access(PDO $pdo, string $email): void {
    $raw = bin2hex(random_bytes(32));
    $pdo->prepare('INSERT INTO access_sessions(session_hash,email,created_at,expires_at) VALUES(?,?,?,?)')
        ->execute([hash('sha256', $raw), strtolower($email), gmdate('Y-m-d\TH:i:s\Z'), time() + MNC_ACCESS_TTL]);
    setcookie(MNC_ACCESS_COOKIE, $raw, [
        'expires' => time() + MNC_ACCESS_TTL, 'path' => '/', 'secure' => mnc_cookie_secure(),
        'httponly' => true, 'samesite' => 'Lax',
    ]);
}

function mnc_clear_access_cookie(): void {
    setcookie(MNC_ACCESS_COOKIE, '', ['expires' => time() - 3600, 'path' => '/', 'secure' => mnc_cookie_secure(), 'httponly' => true, 'samesite' => 'Lax']);
}

/* The email this browser is unlocked for, or null. The single source of truth. */
function mnc_current_access(PDO $pdo): ?string {
    $raw = (string)($_COOKIE[MNC_ACCESS_COOKIE] ?? '');
    if (!preg_match('/^[a-f0-9]{64}$/', $raw)) return null;
    $st = $pdo->prepare('SELECT a.email FROM access_sessions a JOIN subscribers s ON s.email=a.email AND s.status="VERIFIED" WHERE a.session_hash=? AND a.expires_at>?');
    $st->execute([hash('sha256', $raw), time()]);
    $email = $st->fetchColumn();
    return $email ? (string)$email : null;
}

function mnc_utc(): string { return gmdate('Y-m-d\TH:i:s\Z'); }

/* Retention, as stated on the privacy page: unconfirmed addresses 30 days,
   contact messages and the sign-up log 12 months, expired sign-ins removed. */
function mnc_retention(PDO $pdo): void {
    $pdo->prepare('DELETE FROM subscribers WHERE status<>"VERIFIED" AND COALESCE(updated_at,created_at) < ?')->execute([gmdate('Y-m-d\\TH:i:s\\Z', time() - 30 * 86400)]);
    $pdo->prepare('DELETE FROM contacts WHERE created_at < ?')->execute([gmdate('Y-m-d\\TH:i:s\\Z', time() - 365 * 86400)]);
    $pdo->prepare('DELETE FROM audit_log WHERE created_at < ?')->execute([date(DATE_ATOM, time() - 365 * 86400)]);
    $pdo->prepare('DELETE FROM access_sessions WHERE expires_at < ?')->execute([time()]);
}
