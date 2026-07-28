<?php
declare(strict_types=1);require __DIR__.'/config.php';$email=filter_var((string)($_GET['email']??$_POST['email']??''),FILTER_VALIDATE_EMAIL);if(!$email)mnc_page('Invalid email','Enter a valid email address.');$pdo=mnc_db();$st=$pdo->prepare('DELETE FROM subscribers WHERE email=?');$st->execute([$email]);mnc_page('Unsubscribed','The subscriber record has been removed.');
