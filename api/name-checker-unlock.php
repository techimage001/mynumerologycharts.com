<?php
/* Name Checker licence check.
   GET  ?action=config            -> prices and checkout links for the page
   POST action=activate key device -> activate a licence key with Lemon Squeezy
   POST action=validate key instance -> re-check a stored key
   The licence API needs no secret key, so nothing private lives here. */
declare(strict_types=1);
require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

$cfg = require __DIR__ . '/name-checker-config.php';
$override = getenv('MNC_NC_CONFIG');                    /* test harness only */
if ($override && is_file($override)) { $cfg = array_replace_recursive($cfg, require $override); }

function nc_out(array $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

$action = (string)($_POST['action'] ?? $_GET['action'] ?? '');

if ($action === 'config') {
    nc_out([
        'ok'       => true,
        'paid'     => !empty($cfg['paid']),
        'ready'    => (int)$cfg['store_id'] > 0,
        'checkout' => array_map('strval', $cfg['checkout']),
        'price'    => $cfg['price'],
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !in_array($action, ['activate', 'validate'], true)) {
    nc_out(['ok' => false, 'message' => 'Unknown request.'], 400);
}

if ((int)$cfg['store_id'] <= 0) {
    nc_out(['ok' => false, 'message' => 'Payments are not switched on yet. Please contact us and we will sort it out.']);
}

$key = trim((string)($_POST['key'] ?? ''));
if (!preg_match('/^[A-Za-z0-9-]{8,80}$/', $key)) {
    nc_out(['ok' => false, 'definitive' => true, 'message' => 'That does not look like a licence key. Copy it from your receipt email, including the dashes.']);
}

/* 20 attempts per hour per connection: plenty for a real buyer, useless
   for anyone guessing keys. */
try {
    if (!mnc_rate_limit(mnc_db(), 'nc_unlock', mnc_client_ip(), 20, 3600)) {
        nc_out(['ok' => false, 'message' => 'Too many attempts. Please wait an hour and try again.'], 429);
    }
} catch (Throwable $e) { /* private folder missing: carry on rather than block a paying customer */ }

function nc_call(string $base, string $path, array $fields): ?array {
    $url = rtrim($base, '/') . $path;
    $body = http_build_query($fields);
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true, CURLOPT_POSTFIELDS => $body, CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15, CURLOPT_CONNECTTIMEOUT => 8,
            CURLOPT_HTTPHEADER => ['Accept: application/json', 'Content-Type: application/x-www-form-urlencoded'],
        ]);
        $raw = curl_exec($ch);
        curl_close($ch);
    } else {
        $raw = @file_get_contents($url, false, stream_context_create(['http' => [
            'method' => 'POST', 'timeout' => 15, 'ignore_errors' => true, 'content' => $body,
            'header' => "Accept: application/json\r\nContent-Type: application/x-www-form-urlencoded\r\n",
        ]]));
    }
    if (!is_string($raw) || $raw === '') { return null; }
    $j = json_decode($raw, true);
    return is_array($j) ? $j : null;
}

/* Is this key from OUR store, and which variant? Without the store check,
   a licence from any other Lemon Squeezy shop would unlock the report. */
function nc_tier(array $cfg, array $res): ?string {
    $meta = $res['meta'] ?? [];
    if ((int)($meta['store_id'] ?? 0) !== (int)$cfg['store_id']) { return null; }
    $variant = (int)($meta['variant_id'] ?? 0);
    foreach ($cfg['variants'] as $tier => $id) {
        if ((int)$id > 0 && (int)$id === $variant) { return $tier; }
    }
    /* Variant IDs not filled in yet: fall back on whether the key expires. */
    if ((int)$cfg['variants']['pass'] === 0 && (int)$cfg['variants']['lifetime'] === 0) {
        return empty($res['license_key']['expires_at']) ? 'lifetime' : 'pass';
    }
    return null;
}

if ($action === 'activate') {
    $device = preg_replace('/[^A-Za-z0-9]/', '', (string)($_POST['device'] ?? '')) ?: 'device';
    $res = nc_call($cfg['api_base'], '/v1/licenses/activate', ['license_key' => $key, 'instance_name' => 'web-' . substr($device, 0, 40)]);
    if ($res === null) { nc_out(['ok' => false, 'message' => 'We could not reach the payment service. Please try again in a minute.']); }

    if (empty($res['activated'])) {
        $err = strtolower((string)($res['error'] ?? ''));
        $msg = 'That licence key was not accepted.';
        if (strpos($err, 'activation limit') !== false) { $msg = 'This key is already in use on its maximum number of devices. Use it on a device where it is already unlocked, or contact us and we will reset it.'; }
        elseif (strpos($err, 'expired') !== false) { $msg = 'This 30-day pass has expired. You can buy a new pass or the unlimited version.'; }
        elseif (strpos($err, 'not found') !== false || strpos($err, 'invalid') !== false) { $msg = 'We could not find that key. Check it against your receipt email.'; }
        nc_out(['ok' => false, 'definitive' => true, 'message' => $msg]);
    }
    $tier = nc_tier($cfg, $res);
    if ($tier === null) { nc_out(['ok' => false, 'definitive' => true, 'message' => 'That key belongs to a different product.']); }

    nc_out([
        'ok'         => true,
        'tier'       => $tier,
        'instance'   => (string)($res['instance']['id'] ?? ''),
        'expires_at' => $res['license_key']['expires_at'] ?? null,
    ]);
}

/* validate */
$fields = ['license_key' => $key];
$inst = preg_replace('/[^A-Za-z0-9-]/', '', (string)($_POST['instance'] ?? ''));
if ($inst !== '') { $fields['instance_id'] = $inst; }
$res = nc_call($cfg['api_base'], '/v1/licenses/validate', $fields);
if ($res === null) { nc_out(['ok' => false, 'message' => 'Payment service unreachable.']); }   /* not definitive: keep the unlock */
if (empty($res['valid'])) { nc_out(['ok' => false, 'definitive' => true, 'message' => 'This licence is no longer active.']); }
$tier = nc_tier($cfg, $res);
if ($tier === null) { nc_out(['ok' => false, 'definitive' => true, 'message' => 'That key belongs to a different product.']); }
nc_out(['ok' => true, 'tier' => $tier, 'expires_at' => $res['license_key']['expires_at'] ?? null]);
