<?php
declare(strict_types=1);

/*
  Dependency-free authenticated SMTP sender.
  Ported from the Card Maker Messages reference stack.

  No Composer, no PHPMailer, no SSH required. Talks raw SMTP over a
  socket, exactly as the reference build does.

  Never uses PHP mail(): unauthenticated mail() sends from the wrong
  server identity, is throttled by the host, and is silently dropped
  or spam-filed with no way to detect the failure.

  $error is populated by reference on failure so the caller can log
  a real reason instead of a bare false.
*/

function mnc_smtp_transmit(array $config, string $to, string $subject, string $body, ?string &$error = null): bool
{
    $error = null;

    $host     = (string)($config['host'] ?? '');
    $port     = (int)($config['port'] ?? 465);
    $secure   = strtolower((string)($config['secure'] ?? ($port === 465 ? 'ssl' : 'tls')));
    $user     = (string)($config['user'] ?? '');
    $pass     = (string)($config['pass'] ?? '');
    $from     = (string)($config['from'] ?? '');
    $fromName = (string)($config['from_name'] ?? '');
    $helo     = (string)($config['helo'] ?? 'mynumerologycharts.com');

    if ($host === '' || $user === '' || $pass === '') {
        $error = 'SMTP is not configured: host, user or password is empty in secrets.php.';
        return false;
    }
    if ($from === '') {
        $from = $user;
    }

    $transport = ($secure === 'ssl') ? 'ssl://' . $host : $host;
    $socket = @stream_socket_client(
        $transport . ':' . $port,
        $errno,
        $errstr,
        20,
        STREAM_CLIENT_CONNECT
    );
    if (!$socket) {
        $error = 'Could not connect to ' . $host . ':' . $port . ' (' . $errno . ' ' . $errstr . ')';
        return false;
    }
    stream_set_timeout($socket, 20);

    $read = static function () use ($socket): string {
        $out = '';
        while (($line = fgets($socket, 615)) !== false) {
            $out .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') {
                break;
            }
        }
        return $out;
    };

    $lastReply = '';
    $cmd = static function (string $command, array $ok, string $label) use ($socket, $read, &$error, &$lastReply): bool {
        fwrite($socket, $command . "\r\n");
        $reply = $read();
        $lastReply = $reply;
        $code = (int)substr($reply, 0, 3);
        if (!in_array($code, $ok, true)) {
            $error = $label . ' failed (server said: ' . trim($reply) . ')';
            return false;
        }
        return true;
    };

    $greeting = $read();
    if ((int)substr($greeting, 0, 3) !== 220) {
        $error = 'Unexpected greeting: ' . trim($greeting);
        fclose($socket);
        return false;
    }

    if (!$cmd('EHLO ' . $helo, [250], 'EHLO')) { fclose($socket); return false; }

    if ($secure !== 'ssl') {
        if (!$cmd('STARTTLS', [220], 'STARTTLS')) { fclose($socket); return false; }
        if (!@stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            $error = 'TLS negotiation failed.';
            fclose($socket);
            return false;
        }
        if (!$cmd('EHLO ' . $helo, [250], 'EHLO after STARTTLS')) { fclose($socket); return false; }
    }

    if (!$cmd('AUTH LOGIN', [334], 'AUTH LOGIN')) { fclose($socket); return false; }
    if (!$cmd(base64_encode($user), [334], 'SMTP username')) { fclose($socket); return false; }
    if (!$cmd(base64_encode($pass), [235], 'SMTP password')) {
        $error = 'Mailbox login rejected. Check smtp_user and smtp_pass in secrets.php. '
               . 'The password must be the mailbox password, not the hosting or admin password.';
        fclose($socket);
        return false;
    }

    if (!$cmd('MAIL FROM:<' . $from . '>', [250], 'MAIL FROM')) { fclose($socket); return false; }
    if (!$cmd('RCPT TO:<' . $to . '>', [250, 251], 'RCPT TO')) { fclose($socket); return false; }
    if (!$cmd('DATA', [354], 'DATA')) { fclose($socket); return false; }

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $encodedName    = $fromName !== '' ? '=?UTF-8?B?' . base64_encode($fromName) . '?= ' : '';

    $headers = [
        'Date: ' . date(DATE_RFC2822),
        'From: ' . $encodedName . '<' . $from . '>',
        'To: <' . $to . '>',
        'Subject: ' . $encodedSubject,
        'Message-ID: <' . bin2hex(random_bytes(12)) . '@mynumerologycharts.com>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];

    $normalised = preg_replace("/\r\n|\r|\n/", "\r\n", $body) ?? $body;
    $safeBody   = preg_replace('/^\./m', '..', $normalised) ?? $normalised;

    fwrite($socket, implode("\r\n", $headers) . "\r\n\r\n" . $safeBody . "\r\n.\r\n");
    $reply = $read();
    $accepted = (int)substr($reply, 0, 3) === 250;
    if (!$accepted) {
        $error = 'Message rejected at delivery (server said: ' . trim($reply) . ')';
    }

    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    return $accepted;
}
