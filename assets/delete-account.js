/* Self-service account deletion.

   The address is taken from what this browser already has stored, so the user
   does not type it. Local data is cleared immediately and unconditionally,
   because that belongs to this device and needs no permission from anyone.

   The server record still needs the emailed confirmation link, because sign-up
   here has no password and verify.php sets no server session, so the server has
   no way to tell who is asking. Without that step anyone could delete any
   address they typed. */
(function () {
  var box = document.getElementById('daPanel');
  if (!box) return;

  function storedEmail() {
    try {
      var raw = localStorage.getItem('mnc-account');
      if (!raw) return '';
      if (raw.indexOf('@') > -1 && raw.charAt(0) !== '{') return raw;
      var o = JSON.parse(raw);
      return o.email || o.address || '';
    } catch (e) { return ''; }
  }

  function wipeLocal() {
    var removed = [];
    ['mnc-account', 'mnc-profiles', 'mnc-use', 'mnc-app'].forEach(function (k) {
      try { if (localStorage.getItem(k) !== null) { localStorage.removeItem(k); removed.push(k); } } catch (e) {}
    });
    try { sessionStorage.clear(); } catch (e) {}
    return removed;
  }

  var email = storedEmail();
  var status = document.getElementById('daStatus');
  var btn = document.getElementById('daGo');
  var who = document.getElementById('daWho');
  var manual = document.getElementById('daManual');

  if (email) {
    who.textContent = email;
    who.parentElement.hidden = false;
    manual.hidden = true;
  } else {
    who.parentElement.hidden = true;
    manual.hidden = false;
  }

  btn.addEventListener('click', function () {
    var addr = email || (document.getElementById('daEmail') || {}).value || '';
    addr = String(addr).trim();
    if (!addr || addr.indexOf('@') < 1) {
      status.textContent = 'Enter the email address you signed up with.';
      return;
    }
    if (!window.confirm('Delete your account?\n\nThis removes your saved charts from this device straight away, and permanently deletes your record once you open the link we email you. It cannot be undone.')) return;

    btn.disabled = true;
    status.textContent = 'Working...';

    var removed = wipeLocal();

    var body = new URLSearchParams();
    body.set('email', addr);
    body.set('ajax', '1');
    fetch('api/delete-account.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    }).then(function () {
      status.innerHTML = '<strong>Saved data on this device has been cleared'
        + (removed.length ? ' (' + removed.length + ' item' + (removed.length === 1 ? '' : 's') + ')' : '')
        + '.</strong><br>If that address is on our records, a confirmation link is on its way. '
        + 'Open it to delete the server record permanently. The link lasts 24 hours.';
      btn.textContent = 'Done';
    }).catch(function () {
      status.innerHTML = '<strong>Saved data on this device has been cleared.</strong><br>'
        + 'We could not reach the server to send the confirmation email. '
        + 'Please try again shortly, or use the contact form.';
      btn.disabled = false;
    });
  });
})();
